import { APP_ROOT_PATH } from "../core/routes.const"

const ROOT_PATH = `${APP_ROOT_PATH}/content/:kind`;
const DETAIL_PATH = `${ROOT_PATH}/:contentTypeId`;

export const CONTENT_PATHS = {
	ROOT: `${ROOT_PATH}`,
	CREATE: `${ROOT_PATH}/create`,
	CREATE_DETAIL: `${ROOT_PATH}/create/:contentTypeId`,
	DETAIL: `${DETAIL_PATH}`
}
