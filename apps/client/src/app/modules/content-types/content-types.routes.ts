import { APP_ROOT_PATH } from "../core/routes.const"

const ROOT_PATH = `${APP_ROOT_PATH}/content-types`;
const DETAIL_PATH = `${ROOT_PATH}/:contentTypeId`;
const FIELD_DETAIL_PATH = `${DETAIL_PATH}/fields/:fieldId`;

export const CONTENT_TYPES_PATHS = {
	ROOT: `${ROOT_PATH}`,
	CREATE: `${ROOT_PATH}/create`,
	DETAIL: `${DETAIL_PATH}`,
	DETAIL_SETTINGS: `${DETAIL_PATH}/settings`,
	DETAIL_CC: `${DETAIL_PATH}/content-components`,

	FIELD_DETAIL: `${FIELD_DETAIL_PATH}`,
	FIELD_DETAIL_SETTINGS: `${FIELD_DETAIL_PATH}/settings`,
	FIELD_DETAIL_CONFIGURATION: `${FIELD_DETAIL_PATH}/configuration`,
	FIELD_DETAIL_VALIDATION: `${FIELD_DETAIL_PATH}/validation`,
	FIELD_DETAIL_DEFAULT_VALUE: `${FIELD_DETAIL_PATH}/default-value`,
}
