use crate::errors::AppError;
use crate::schema::sites;
use chrono::NaiveDateTime;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use slug::slugify;
use tracing::instrument;
use uuid::Uuid;

#[derive(Identifiable, Queryable, Selectable, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = sites)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Site {
	pub id: Uuid,
	pub slug: String,
	pub name: String,
	pub url: Option<String>,
	pub image: Option<String>,
	pub description: Option<String>,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl Site {
	#[instrument(skip(conn))]
	pub fn create(conn: &mut PgConnection, name: &str) -> Result<Site, AppError> {
		use diesel::prelude::*;

		let record = CreateSite {
			name,
			slug: &slugify(name),
		};

		let site = diesel::insert_into(sites::table)
			.values(&record)
			.returning(Site::as_returning())
			.get_result::<Site>(conn)?;

		Ok(site)
	}

	pub fn find_one(conn: &mut PgConnection, id: Uuid) -> Result<Self, AppError> {
		let t = sites::table.find(id);
		let site = t.first(conn)?;
		Ok(site)
	}

	pub fn find(
		conn: &mut PgConnection,
		page: i64,
		pagesize: i64,
	) -> Result<(Vec<Self>, i64), AppError> {
		let sites = sites::table
			.select(Site::as_select())
			.offset((page - 1) * pagesize)
			.limit(pagesize)
			.load::<Site>(conn)?;
		let total_elements = sites::table.count().get_result::<i64>(conn)?;

		Ok((sites, total_elements))
	}

	pub fn update(
		conn: &mut PgConnection,
		site_id: Uuid,
		changeset: UpdateSite,
	) -> Result<Self, AppError> {
		let target = sites::table.find(site_id);
		let user = diesel::update(target)
			.set(changeset)
			.get_result::<Site>(conn)?;
		Ok(user)
	}

	pub fn remove(conn: &mut PgConnection, site_id: Uuid) -> Result<(), AppError> {
		let target = sites::table.find(site_id);
		diesel::delete(target).get_result::<Site>(conn)?;
		Ok(())
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = sites)]
pub struct CreateSite<'a> {
	pub name: &'a str,
	pub slug: &'a str,
}

#[derive(AsChangeset, Debug, Deserialize)]
#[diesel(table_name = sites)]
pub struct UpdateSite {
	pub name: Option<String>,
}
