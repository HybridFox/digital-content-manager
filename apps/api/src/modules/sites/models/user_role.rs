use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::Deserialize;
use uuid::Uuid;

use crate::modules::auth::models::user::User;
use crate::modules::roles::models::role::Role;

use crate::errors::AppError;
use crate::schema::users_roles;

#[derive(Identifiable, Selectable, Queryable, Associations, Debug)]
#[diesel(belongs_to(User))]
#[diesel(belongs_to(Role))]
#[diesel(table_name = users_roles)]
#[diesel(primary_key(user_id, role_id))]
pub struct UserRole {
	pub user_id: Uuid,
	pub role_id: Uuid,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl UserRole {
	pub fn create(
		conn: &mut PgConnection,
		user_id: Uuid,
		role_id: Uuid,
	) -> Result<Vec<Self>, AppError> {
		let user_role = diesel::insert_into(users_roles::table)
			.values(CreateUserRole {
				user_id,
				role_id,
			})
			.returning(UserRole::as_returning())
			.get_results(conn)?;

		Ok(user_role)
	}

	pub fn upsert_many(
		conn: &mut PgConnection,
		user_id: Uuid,
		role_ids: Vec<Uuid>,
	) -> Result<Vec<Self>, AppError> {
		let target = users_roles::table
			.filter(users_roles::user_id.eq(user_id));
		diesel::delete(target).execute(conn)?;

		let insert_items: Vec<CreateUserRole> = role_ids
			.into_iter()
			.map(|role_id| CreateUserRole {
				user_id,
				role_id,
			})
			.collect();

		let permissions_iam_actions = diesel::insert_into(users_roles::table)
			.values(insert_items)
			.returning(UserRole::as_returning())
			.get_results(conn)?;

		Ok(permissions_iam_actions)
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = users_roles)]
pub struct CreateUserRole {
	pub user_id: Uuid,
	pub role_id: Uuid,
}
