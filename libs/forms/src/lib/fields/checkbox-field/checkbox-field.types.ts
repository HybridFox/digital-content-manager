import { IGenericFieldProps } from "../fields.types";

export interface ICheckboxOption {
	label: string;
	value: string;
}

export interface ICheckboxFieldProps extends IGenericFieldProps {
	placeholder?: string;
}
