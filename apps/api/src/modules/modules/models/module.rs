use diesel::prelude::*;
use serde::Deserialize;
use tracing::instrument;
use uuid::Uuid;

use crate::errors::AppError;
use crate::schema::modules;

#[derive(Identifiable, Selectable, Queryable, Debug, Clone)]
#[diesel(table_name = modules)]
#[diesel(primary_key(id))]
pub struct Module {
	pub id: Uuid,
	pub name: String,
	pub entry_url: String,
	pub active: bool,
	pub site_id: Uuid,
}

impl Module {
	#[instrument(skip(conn))]
	pub fn create(conn: &mut PgConnection, module: CreateModule) -> Result<Self, AppError> {
		let created_module = diesel::insert_into(modules::table)
			.values(module)
			.returning(Module::as_returning())
			.get_result(conn)?;

		Ok(created_module)
	}

	#[instrument(skip(conn))]
	pub fn find_one(conn: &mut PgConnection, id: Uuid) -> Result<Self, AppError> {
		let module = modules::table.find(id).first::<Self>(conn)?;

		Ok(module)
	}

	#[instrument(skip(conn))]
	pub fn find(
		conn: &mut PgConnection,
		site_id: Uuid,
		page: i64,
		pagesize: i64,
		all: Option<bool>,
	) -> Result<(Vec<Self>, i64), AppError> {
		let query = {
			let mut query = modules::table
				.filter(modules::site_id.eq(site_id))
				.into_boxed();

			if pagesize != -1 {
				query = query.offset((page - 1) * pagesize).limit(pagesize);
			};

			if all.is_none() || all.unwrap_or(false) == false {
				query = query.filter(modules::active.eq(true))
			}

			query
		};

		let modules = query.select(Module::as_select()).load::<Module>(conn)?;
		let total_elements = modules::table.count().get_result::<i64>(conn)?;

		Ok((modules, total_elements))
	}

	#[instrument(skip(conn))]
	pub fn update(
		conn: &mut PgConnection,
		id: Uuid,
		changeset: UpdateModule,
	) -> Result<Self, AppError> {
		let target = modules::table.find(id);
		let updated_module = diesel::update(target)
			.set(changeset)
			.returning(Self::as_returning())
			.get_result::<Self>(conn)?;

		Ok(updated_module)
	}

	#[instrument(skip(conn))]
	pub fn remove(conn: &mut PgConnection, content_id: Uuid) -> Result<(), AppError> {
		diesel::delete(modules::table.filter(modules::id.eq(content_id)))
			.get_result::<Module>(conn)?;

		Ok(())
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = modules)]
pub struct CreateModule {
	pub name: String,
	pub entry_url: String,
	pub site_id: Uuid,
	pub active: bool,
}

#[derive(AsChangeset, Debug, Deserialize, Clone)]
#[diesel(table_name = modules)]
pub struct UpdateModule {
	pub name: Option<String>,
	pub entry_url: Option<String>,
	pub active: Option<bool>,
}
