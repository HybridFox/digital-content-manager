use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::Deserialize;
use uuid::Uuid;

use crate::modules::auth::models::user::User;
use crate::modules::teams::models::team::Team;
use crate::modules::roles::models::role::Role;

use crate::errors::AppError;
use crate::schema::teams_users;

#[derive(Identifiable, Selectable, Queryable, Associations, Debug)]
#[diesel(belongs_to(User))]
#[diesel(belongs_to(Team))]
#[diesel(belongs_to(Role))]
#[diesel(table_name = teams_users)]
#[diesel(primary_key(user_id, team_id, role_id))]
pub struct TeamUser {
	pub user_id: Uuid,
	pub team_id: Uuid,
	pub role_id: Uuid,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl TeamUser {
	pub fn create(
		conn: &mut PgConnection,
		user_id: Uuid,
		team_id: Uuid,
		role_id: Uuid,
	) -> Result<Vec<Self>, AppError> {
		let permissions_iam_actions = diesel::insert_into(teams_users::table)
			.values(CreateTeamUser {
				user_id,
				team_id,
				role_id,
			})
			.returning(TeamUser::as_returning())
			.get_results(conn)?;

		Ok(permissions_iam_actions)
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = teams_users)]
pub struct CreateTeamUser {
	pub user_id: Uuid,
	pub team_id: Uuid,
	pub role_id: Uuid,
}
