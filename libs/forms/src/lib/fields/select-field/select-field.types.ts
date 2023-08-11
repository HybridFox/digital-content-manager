import { IGenericFieldProps } from "../fields.types";

export interface ISelectOptions {
	label: string;
	value: string;
}

export interface ISelectFieldProps extends IGenericFieldProps {
	placeholder?: string;
}
