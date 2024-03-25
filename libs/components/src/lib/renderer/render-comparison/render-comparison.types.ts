import { FieldViewMode } from "../../../../../forms/src/lib/fields/fields.types";

import { IField } from "~shared";


export interface IRenderComparisonProps {
	fields: IField[];
	siteId: string;
	fieldPrefix?: string;
	viewMode?: FieldViewMode;
}
