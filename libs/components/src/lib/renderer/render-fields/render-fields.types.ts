import { FIELD_VIEW_MODE } from "../../../../../forms/src/lib/fields/fields.types";

import { IField } from "~shared";


export interface IRenderFieldsProps {
	fields: IField[];
	siteId: string;
	fieldPrefix?: string;
	viewMode?: FIELD_VIEW_MODE;
}
