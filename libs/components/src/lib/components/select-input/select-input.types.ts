import { FieldValues, RegisterOptions } from "react-hook-form";

export interface ISelectOptions {
	label: string;
	value: string;
}

export interface ISelectInputProps {
	name: string;
	placeholder?: string;
	label?: string;
	options: ISelectOptions[];
	fieldOptions?: RegisterOptions<FieldValues, string>;
}
