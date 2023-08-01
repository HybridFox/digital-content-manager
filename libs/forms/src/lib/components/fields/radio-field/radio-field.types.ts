import { IGenericFieldProps } from "../fields.types";

export interface IRadioOption {
	label: string;
	value: string;
}

export interface IRadioFieldProps extends IGenericFieldProps {
	placeholder?: string;
}
