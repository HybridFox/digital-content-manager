import { IField } from "@ibs/shared";

import { FIELD_VIEW_MODE } from "../../fields/fields.types";

export interface IRenderFieldsProps {
	fields: IField[];
	siteId: string;
	fieldPrefix?: string;
	viewMode?: FIELD_VIEW_MODE;
}
