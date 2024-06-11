use crate::modules::content_types::models::content_type::ContentType;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use tracing::instrument;
use uuid::Uuid;

use crate::errors::AppError;
use crate::schema::compartments;

#[derive(
	Selectable, Queryable, Debug, Identifiable, Associations, Clone, Deserialize, Serialize,
)]
#[diesel(belongs_to(ContentType, foreign_key = content_type_id))]
#[diesel(table_name = compartments)]
#[diesel(primary_key(id))]
pub struct CompartmentModel {
	pub id: Uuid,
	pub name: String,
	pub description: Option<String>,
	pub content_type_id: Uuid,
}

impl CompartmentModel {
	#[instrument(skip(conn))]
	pub fn create(
		conn: &mut PgConnection,
		site_id: Uuid,
		content_type_id: Uuid,
		name: &String,
	) -> Result<Self, AppError> {
		let compartment = diesel::insert_into(compartments::table)
			.values(CreateCompartment {
				name: name.to_owned(),
				content_type_id,
			})
			.returning(CompartmentModel::as_returning())
			.get_result(conn)?;

		Ok(compartment)
	}

	#[instrument(skip(conn))]
	pub fn find_one(conn: &mut PgConnection, _site_id: Uuid, id: Uuid) -> Result<Self, AppError> {
		let compartment = compartments::table.find(id).first::<Self>(conn)?;

		Ok(compartment)
	}

	#[instrument(skip(conn))]
	pub fn find(
		conn: &mut PgConnection,
		_site_id: Uuid,
		content_type_id: Uuid,
		page: i64,
		pagesize: i64,
	) -> Result<(Vec<Self>, i64), AppError> {
		let query = {
			let mut query = compartments::table
				.filter(compartments::content_type_id.eq(content_type_id))
				.into_boxed();

			if pagesize != -1 {
				query = query.offset((page - 1) * pagesize).limit(pagesize);
			};

			query
		};

		let compartments = query
			.select(CompartmentModel::as_select())
			.load::<CompartmentModel>(conn)?;

		let total_elements = compartments::table
			.filter(compartments::content_type_id.eq(content_type_id))
			.count()
			.get_result::<i64>(conn)?;

		Ok((compartments, total_elements))
	}

	#[instrument(skip(conn))]
	pub fn update(
		conn: &mut PgConnection,
		site_id: Uuid,
		id: Uuid,
		changeset: UpdateCompartment,
	) -> Result<Self, AppError> {
		let target = compartments::table.find(id);
		let result = diesel::update(target)
			.set(changeset)
			.get_result::<Self>(conn)?;

		Ok(result)
	}

	#[instrument(skip(conn))]
	pub fn remove(conn: &mut PgConnection, compartment_id: Uuid) -> Result<(), AppError> {
		let target = compartments::table.filter(compartments::id.eq(compartment_id));
		diesel::delete(target).execute(conn)?;

		Ok(())
	}
}

#[derive(Insertable, Debug, Deserialize)]
#[diesel(table_name = compartments)]
pub struct CreateCompartment {
	name: String,
	content_type_id: Uuid,
}

#[derive(AsChangeset, Insertable, Debug, Deserialize)]
#[diesel(table_name = compartments)]
#[serde(rename_all = "camelCase")]
pub struct UpdateCompartment {
	pub name: Option<String>,
	pub description: Option<String>,
}
