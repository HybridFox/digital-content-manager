import { IField } from "@ibs/shared";

export interface IRenderFieldsProps {
	fields: IField[];
	siteId: string;
	fieldPrefix?: string;
}
