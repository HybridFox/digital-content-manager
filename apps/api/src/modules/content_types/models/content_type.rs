use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::Deserialize;
use uuid::Uuid;
use slug::slugify;

use crate::errors::AppError;
use crate::schema::{content_types, sites_content_types};

use super::site_content_type::SiteContentType;

#[derive(Identifiable, Selectable, Queryable, Debug)]
#[diesel(table_name = content_types)]
#[diesel(primary_key(id))]
pub struct ContentType {
	pub id: Uuid,
	pub name: String,
	pub slug: String,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl ContentType {
	pub fn create(
		conn: &mut PgConnection,
		_site_id: Uuid,
		name: &String,
	) -> Result<Self, AppError> {
		let content_type = diesel::insert_into(content_types::table)
			.values(CreateContentType {
				name: name.to_owned(),
				slug: slugify(name)
			})
			.returning(ContentType::as_returning())
			.get_result(conn)?;

		Ok(content_type)
	}
	
	pub fn find_one(conn: &mut PgConnection, _site_id: Uuid, id: Uuid) -> Result<Self, AppError> {
		let content_type = content_types::table.find(id).first::<Self>(conn)?;
		Ok(content_type)
	}

	pub fn find(
		conn: &mut PgConnection,
		site_id: Uuid,
		page: i64,
		pagesize: i64,
	) -> Result<(Vec<Self>, i64), AppError> {
		let content_types = sites_content_types::table
			.filter(sites_content_types::site_id.eq(site_id))
			.offset((page - 1) * pagesize)
			.limit(pagesize)
			.inner_join(content_types::table.on(content_types::id.eq(sites_content_types::content_type_id)))
			.select(ContentType::as_select())
			.load::<ContentType>(conn)?;
		let total_elements = sites_content_types::table.filter(sites_content_types::site_id.eq(site_id)).count().get_result::<i64>(conn)?;

		Ok((content_types, total_elements))
	}

	// pub fn update(
	// 	conn: &mut PgConnection,
	// 	role_id: Uuid,
	// 	changeset: UpdateRole,
	// 	policy_ids: Vec<Uuid>,
	// ) -> Result<(Self, Vec<IAMPolicy>), AppError> {
	// 	let target = roles::table.find(role_id);
	// 	let role = diesel::update(target)
	// 		.set(changeset)
	// 		.get_result::<Role>(conn)?;
	// 	RoleIAMPolicy::create_for_role(conn, role_id, policy_ids)?;
	// 	let policies = Self::find_policies(conn, &role)?;

	// 	Ok((role, policies))
	// }

	pub fn remove(conn: &mut PgConnection, content_type_id: Uuid) -> Result<(), AppError> {
		let target = sites_content_types::table.filter(sites_content_types::content_type_id.eq(content_type_id));
		diesel::delete(target).get_result::<SiteContentType>(conn)?;

		let target = content_types::table.filter(content_types::id.eq(content_type_id));
		diesel::delete(target).get_result::<ContentType>(conn)?;
		Ok(())
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = content_types)]
pub struct CreateContentType {
	name: String,
	slug: String,
}
