import { IField } from "@ibs/shared";

import { FIELD_VIEW_MODE } from "../../../../../forms/src/lib/fields/fields.types";

export interface IRenderComparisonProps {
	fields: IField[];
	siteId: string;
	fieldPrefix?: string;
	viewMode?: FIELD_VIEW_MODE;
}
