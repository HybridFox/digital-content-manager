use crate::errors::{AppError};
use crate::schema::teams;
use chrono::NaiveDateTime;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use slug::slugify;
use tracing::instrument;
use uuid::Uuid;

#[derive(Identifiable, Queryable, Selectable, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = teams)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Team {
	pub id: Uuid,
	pub slug: String,
	pub name: String,
	pub description: Option<String>,
	pub created_at: NaiveDateTime,
	pub updated_at: NaiveDateTime,
}

impl Team {
	#[instrument(skip(conn))]
	pub fn create(conn: &mut PgConnection, name: &str) -> Result<Team, AppError> {
		use diesel::prelude::*;

		let record = CreateTeam {
			name,
			slug: &slugify(name),
		};

		let team = diesel::insert_into(teams::table)
			.values(&record)
			.returning(Team::as_returning())
			.get_result::<Team>(conn)?;

		Ok(team)
	}

	pub fn find_one(conn: &mut PgConnection, id: Uuid) -> Result<Self, AppError> {
		let t = teams::table.find(id);
		let team = t.first(conn)?;
		Ok(team)
	}

	pub fn find(
		conn: &mut PgConnection,
		page: i64,
		pagesize: i64,
	) -> Result<(Vec<Self>, i64), AppError> {
		let teams = teams::table
			.select(Team::as_select())
			.offset((page - 1) * pagesize)
			.limit(pagesize)
			.load::<Team>(conn)?;
		let total_elements = teams::table.count().get_result::<i64>(conn)?;

		Ok((teams, total_elements))
	}

	pub fn update(
		conn: &mut PgConnection,
		team_id: Uuid,
		changeset: UpdateTeam,
	) -> Result<Self, AppError> {
		let target = teams::table.find(team_id);
		let user = diesel::update(target)
			.set(changeset)
			.get_result::<Team>(conn)?;
		Ok(user)
	}

	pub fn remove(conn: &mut PgConnection, team_id: Uuid) -> Result<(), AppError> {
		let target = teams::table.find(team_id);
		diesel::delete(target).get_result::<Team>(conn)?;
		Ok(())
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = teams)]
pub struct CreateTeam<'a> {
	pub name: &'a str,
	pub slug: &'a str,
}

#[derive(AsChangeset, Debug, Deserialize)]
#[diesel(table_name = teams)]
pub struct UpdateTeam {
	pub name: Option<String>,
}
