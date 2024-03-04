import { APP_SITE_ROOT_PATH } from "../core/routes.const"

const ROOT_PATH = `${APP_SITE_ROOT_PATH}/content/:kind`;
const DETAIL_PATH = `${ROOT_PATH}/:contentId`;

export const CONTENT_PATHS = {
	ROOT: `${ROOT_PATH}`,
	ROOT_DETAIL: `${APP_SITE_ROOT_PATH}/content`,
	CREATE: `${ROOT_PATH}/create`,
	CREATE_DETAIL: `${ROOT_PATH}/create/:contentTypeId`,
	DETAIL: `${DETAIL_PATH}`,
	DETAIL_SETTINGS: `${DETAIL_PATH}/settings`,
	DETAIL_FIELDS: `${DETAIL_PATH}/fields`,
	DETAIL_COMPARTMENT: `${DETAIL_PATH}/fields/:compartmentId`,
	DETAIL_TRANSLATIONS: `${DETAIL_PATH}/translations`,
	DETAIL_REVISIONS: `${DETAIL_PATH}/revisions`,
	DETAIL_REVISION_PREVIEW: `${DETAIL_PATH}/revisions/:revisionId`,
	DETAIL_REVISION_COMPARE: `${DETAIL_PATH}/revisions/:firstRevisionId/compare/:secondRevisionId`,
	DETAIL_STATUS: `${DETAIL_PATH}/status`,
}
