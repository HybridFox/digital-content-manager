import { FieldViewMode } from "../../fields";

import { IField } from "~shared";


export interface IRenderComparisonProps {
	fields: IField[];
	siteId: string;
	fieldPrefix?: string;
	viewMode?: FieldViewMode;
}
