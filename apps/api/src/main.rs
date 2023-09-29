#[macro_use]
extern crate lazy_static;

use std::env;
use std::error::Error;

use actix_web::http::StatusCode;
use actix_web::{web, App, HttpServer, HttpResponse};
use errors::{AppErrorValue, AppError};
use modules::core::middleware::state::AppConn;
use opentelemetry::KeyValue;
use opentelemetry_otlp::WithExportConfig;
use tracing_actix_web::TracingLogger;
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use tracing_bunyan_formatter::BunyanFormattingLayer;
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::{EnvFilter, Registry};
use opentelemetry::{global, runtime::TokioCurrentThread, sdk::propagation::TraceContextPropagator};
use opentelemetry::sdk::{trace, Resource};
use dotenv::dotenv;

use crate::modules::iam_actions::models::iam_action::IAMAction;
use crate::openapi::{ApiDoc};
use serde_qs::actix::{QsQuery, QsQueryConfig};
use serde_qs::Config as QsConfig;

pub mod constants;
pub mod errors;
pub mod modules;
pub mod openapi;
pub mod routes;
pub mod schema;
pub mod utils;

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

async fn run_migrations(conn: &mut AppConn) -> Result<(), Box<dyn Error + Send + Sync + 'static>> {
	let _ = conn.run_pending_migrations(MIGRATIONS)?;

	Ok(())
}

async fn not_found() -> Result<HttpResponse, AppError> {
	Err(AppError::NotFound(AppErrorValue {
		message: "Resource could not be found".to_owned(),
		status: StatusCode::NOT_FOUND.as_u16(),
		code: "NOT_FOUND".to_owned(),
		..Default::default()
	}))
}

fn init_telemetry() {
	// Spans are exported in batch - recommended setup for a production application.
	global::set_text_map_propagator(TraceContextPropagator::new());
	let tracer = opentelemetry_otlp::new_pipeline()
		.tracing()
		.with_exporter(opentelemetry_otlp::new_exporter().tonic().with_endpoint(
			env::var(constants::env_key::OTEL_ENDPOINT).expect("Otel endpoint is not set"),
		))
		.with_trace_config(trace::config().with_resource(Resource::new(vec![
			KeyValue::new("service.name", "ibs-api"),
			KeyValue::new("service.language.name", "rust"),
		])))
		.install_batch(TokioCurrentThread)
		.expect("Failed to install OpenTelemetry tracer.");

	// Filter based on level - trace, debug, info, warn, error
	// Tunable via `RUST_LOG` env variable
	let env_filter = EnvFilter::try_from_default_env().unwrap_or(EnvFilter::new("info"));
	// Create a `tracing` layer using the Jaeger tracer
	let telemetry = tracing_opentelemetry::layer().with_tracer(tracer);
	// Create a `tracing` layer to emit spans as structured logs to stdout
	let formatting_layer = BunyanFormattingLayer::new("ibs-api".into(), std::io::stdout);
	// Combined them all together in a `tracing` subscriber
	let subscriber = Registry::default()
		.with(env_filter)
		.with(telemetry)
		// .with(JsonStorageLayer)
		.with(formatting_layer);

	tracing::subscriber::set_global_default(subscriber)
		.expect("Failed to install `tracing` subscriber.")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
	dotenv().ok();
	init_telemetry();

	println!("start server...");
	let state: modules::core::middleware::state::AppState = {
		let pool = utils::db::establish_connection();

		modules::core::middleware::state::AppState { pool }
	};
	println!("Database connected");

	let conn = &mut state.get_conn().unwrap();
	let _ = run_migrations(conn).await;
	let _ = IAMAction::upsert(conn);
	println!("Migrations ok");

	HttpServer::new(move || {
		App::new()
			.wrap(TracingLogger::default())
			.app_data(actix_web::web::Data::new(state.clone()))
			.app_data(web::JsonConfig::default().error_handler(|err, _| {
				AppError::BadRequest(AppErrorValue {
					message: err.to_string(),
					status: StatusCode::BAD_REQUEST.as_u16(),
					code: "JSON_PARSE_FAILED".to_owned(),
					..Default::default()
				})
				.into()
			}))
			.app_data(web::QueryConfig::default().error_handler(|err, _| {
				AppError::BadRequest(AppErrorValue {
					message: err.to_string(),
					status: StatusCode::BAD_REQUEST.as_u16(),
					code: "QUERY_PARSE_FAILED".to_owned(),
					..Default::default()
				})
				.into()
			}))
			.app_data(web::PathConfig::default().error_handler(|err, _| {
				AppError::BadRequest(AppErrorValue {
					message: err.to_string(),
					status: StatusCode::BAD_REQUEST.as_u16(),
					code: "PATH_PARSE_FAILED".to_owned(),
					..Default::default()
				})
				.into()
			}))
			.app_data(
				QsQueryConfig::default()
					.error_handler(|err, _| {
						AppError::BadRequest(AppErrorValue {
							message: err.to_string(),
							status: StatusCode::BAD_REQUEST.as_u16(),
							code: "QS_PARSE_FAILED".to_owned(),
							..Default::default()
						})
						.into()
					})
					.qs_config(QsConfig::new(10, false)),
			)
			// .wrap(modules::core::middleware::cors::cors())
			.wrap(modules::core::middleware::auth::Authentication)
			.wrap(modules::core::middleware::installation::Installation)
			.service(SwaggerUi::new("/docs/{_:.*}").url("/docs/openapi.json", ApiDoc::openapi()))
			.configure(routes::api)
			.default_service(web::route().to(not_found))
	})
	.bind(constants::BIND)?
	.run()
	.await?;

	opentelemetry::global::shutdown_tracer_provider();
	Ok(())
}
