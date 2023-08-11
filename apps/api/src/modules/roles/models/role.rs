use crate::errors::AppError;
use crate::modules::iam_policies::models::iam_policy::IAMPolicy;
use crate::modules::iam_policies::models::roles_iam_policies::RoleIAMPolicy;
use crate::schema::{roles, iam_policies, roles_iam_policies};
use chrono::NaiveDateTime;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use slug::slugify;
use uuid::Uuid;

#[derive(Identifiable, Queryable, Selectable, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = roles)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Role {
	pub id: Uuid,
	pub name: String,
	pub slug: String,
	pub description: Option<String>,
	pub site_id: Uuid,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl Role {
	pub fn create(
		conn: &mut PgConnection,
		site_id: Uuid,
		name: String,
		policy_ids: Vec<Uuid>,
	) -> Result<(Self, Vec<IAMPolicy>), AppError> {
		use diesel::prelude::*;

		let record = CreateRole {
			name: &name,
			site_id,
			slug: &slugify(&name),
		};

		let role = diesel::insert_into(roles::table)
			.values(&record)
			.returning(Role::as_returning())
			.get_result::<Role>(conn)?;
		RoleIAMPolicy::upsert_for_role(conn, role.id, policy_ids)?;
		let policies = Self::find_policies(conn, &role)?;

		Ok((role, policies))
	}

	pub fn find_one(conn: &mut PgConnection, site_id: Uuid, id: Uuid) -> Result<Self, AppError> {
		let t = roles::table.filter(roles::site_id.eq(site_id)).find(id);
		let role = t.first::<Role>(conn)?;
		Ok(role)
	}

	pub fn find_policies(conn: &mut PgConnection, role: &Role) -> Result<Vec<IAMPolicy>, AppError> {
		let policies = RoleIAMPolicy::belonging_to(&role)
			.inner_join(iam_policies::table)
			.select(IAMPolicy::as_select())
			.load(conn)?;
		Ok(policies)
	}

	pub fn find(
		conn: &mut PgConnection,
		site_id: Uuid,
		page: i64,
		pagesize: i64,
	) -> Result<(Vec<(Self, Vec<IAMPolicy>)>, i64), AppError> {
		let query = {
			let mut query = roles::table
				.select(Role::as_select())
				.filter(roles::site_id.eq(site_id))
				.into_boxed();

			if pagesize != -1 {
				query = query.offset((page - 1) * pagesize).limit(pagesize);
			};

			query
		};

		let roles = query.load::<Role>(conn)?;
		let policies: Vec<(RoleIAMPolicy, IAMPolicy)> = RoleIAMPolicy::belonging_to(&roles)
			.inner_join(
				iam_policies::table.on(iam_policies::id.eq(roles_iam_policies::iam_policy_id)),
			)
			.select((RoleIAMPolicy::as_select(), IAMPolicy::as_select()))
			.load::<(RoleIAMPolicy, IAMPolicy)>(conn)?;
		let grouped_policies = policies.grouped_by(&roles);
		let roles_with_policies = roles
			.into_iter()
			.zip(grouped_policies)
			.map(|(role, policies)| {
				let only_policies = policies
					.into_iter()
					.map(|(_role_policy, policy)| policy)
					.collect();

				(role, only_policies)
			})
			.collect::<Vec<(Self, Vec<IAMPolicy>)>>();

		let total_elements = roles::table.count().get_result::<i64>(conn)?;

		Ok((roles_with_policies, total_elements))
	}

	pub fn update(
		conn: &mut PgConnection,
		role_id: Uuid,
		changeset: UpdateRole,
		policy_ids: Vec<Uuid>,
	) -> Result<(Self, Vec<IAMPolicy>), AppError> {
		let target = roles::table.find(role_id);
		let role = diesel::update(target)
			.set(changeset)
			.get_result::<Role>(conn)?;
		RoleIAMPolicy::upsert_for_role(conn, role_id, policy_ids)?;
		let policies = Self::find_policies(conn, &role)?;

		Ok((role, policies))
	}

	pub fn remove(conn: &mut PgConnection, role_id: Uuid) -> Result<(), AppError> {
		let target = roles::table.find(role_id);
		diesel::delete(target).get_result::<Role>(conn)?;
		Ok(())
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = roles)]
pub struct CreateRole<'a> {
	pub name: &'a str,
	pub slug: &'a str,
	pub site_id: Uuid,
}

#[derive(AsChangeset, Debug, Deserialize)]
#[diesel(table_name = roles)]
pub struct UpdateRole {
	pub name: Option<String>,
}
