import { IField } from "~shared";


export interface IEditValidationForm {
	validationRulesEnabled: string[];
	validationRules: any;
}

export interface IValidationFormProps {
	onSubmit: (values: IField) => void;
	loading?: boolean;
	siteId: string;
	contentTypeField: IField;
}
