import { FieldViewMode } from "../../fields";

import { IField } from "~shared";


export interface IRenderFieldsProps {
	fields: IField[];
	siteId: string;
	fieldPrefix?: string;
	viewMode?: FieldViewMode;
}
