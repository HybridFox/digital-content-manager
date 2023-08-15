import { IGenericFieldProps } from "../fields.types";

export interface ISelectOptions {
	label: string;
	value: string;
	options?: ISelectOptions[]
}

export interface ISelectFieldProps extends IGenericFieldProps {
	placeholder?: string;
}
