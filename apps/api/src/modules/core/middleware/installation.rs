use crate::modules::users::models::user::User;
use crate::modules::core::middleware::state::AppState;
use actix_web::{
	body::EitherBody,
	dev::{Service, ServiceRequest, ServiceResponse, Transform},
	web::Data,
	Error, HttpResponse,
	http::Method,
};
use futures::future::{ok, Ready};
use futures::Future;
use regex::Regex;
use serde_json::json;
use std::pin::Pin;
use uuid::Uuid;

// There are two steps in middleware processing.
// 1. Middleware initialization, middleware factory gets called with
//    next service in chain as parameter.
// 2. Middleware's call method gets called with normal request.
pub struct Installation;

// Middleware factory is `Transform` trait from actix-service crate
// `S` - type of the next service
// `B` - type of response's body
impl<S, B> Transform<S, ServiceRequest> for Installation
where
	S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
	S::Future: 'static,
	B: 'static,
{
	type Response = ServiceResponse<EitherBody<B>>;
	type Error = Error;
	type InitError = ();
	type Transform = InstallationMiddleware<S>;
	type Future = Ready<Result<Self::Transform, Self::InitError>>;

	fn new_transform(&self, service: S) -> Self::Future {
		ok(InstallationMiddleware { service })
	}
}

pub struct InstallationMiddleware<S> {
	service: S,
}

impl<S, B> Service<ServiceRequest> for InstallationMiddleware<S>
where
	S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
	S::Future: 'static,
	B: 'static,
{
	type Response = ServiceResponse<EitherBody<B>>;
	type Error = Error;

	#[allow(clippy::type_complexity)] // TODO: want to remove allowness to skip and refactor somehow
	type Future = Pin<Box<dyn Future<Output = Result<Self::Response, Self::Error>>>>;

	actix_web::dev::forward_ready!(service);

	fn call(&self, req: ServiceRequest) -> Self::Future {
		dbg!(is_installed(&req));
		if is_installed(&req) {
			let fut = self.service.call(req);
			Box::pin(async move {
				let res = fut.await?.map_into_left_body();
				Ok(res)
			})
		} else {
			Box::pin(async move {
				let (req, _res) = req.into_parts();
				let res = HttpResponse::ServiceUnavailable()
					.json(json!({
						"message": "Not installed, please follow installation",
						"status": 503,
						"identifier": Uuid::new_v4(),
						"code": "NOT_INSTALLED"
					}))
					.map_into_right_body();

				let srv = ServiceResponse::new(req, res);
				Ok(srv)
			})
		}
	}
}

fn is_installed(req: &ServiceRequest) -> bool {
	let result = if should_skip_check(&req) {
		Ok(1)
	} else {
		find_total_user_count(&req)
	};

	match result {
		Ok(users) => users > 0,
		Err(_) => false,
	}
}

fn should_skip_check(req: &ServiceRequest) -> bool {
	let method = req.method();
	if Method::OPTIONS == *method {
		return true;
	}

	SKIP_CHECK_ROUTES
		.iter()
		.any(|route| route.matches_path_and_method(req.path(), req.method()))
}

fn find_total_user_count(req: &ServiceRequest) -> Result<i64, &str> {
	let conn = &mut req
		.app_data::<Data<AppState>>()
		.ok_or("Cannot get state.")
		.and_then(|state| state.get_conn().map_err(|_err| "Cannot get db connection."))?;

	User::total_count(conn).map_err(|_err| "Cannot get total user count")
}

struct SkipCheckRoute {
	path: Regex,
	method: Method,
}

impl SkipCheckRoute {
	fn matches_path_and_method(&self, path: &str, method: &Method) -> bool {
		self.matches_path(path) && self.matches_method(method)
	}

	fn matches_path(&self, path: &str) -> bool {
		let expect_path = &self.path;

		expect_path.is_match(path)
	}

	fn matches_method(&self, method: &Method) -> bool {
		self.method == method
	}
}

lazy_static! {
	static ref SKIP_CHECK_ROUTES: [SkipCheckRoute; 1] = [SkipCheckRoute {
		path: Regex::new(r"/admin-api/v1/setup/*").unwrap(),
		method: Method::POST,
	},];
}
