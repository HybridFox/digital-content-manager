import { FieldValues, RegisterOptions } from "react-hook-form";

export interface ITextareaInputProps {
	name: string;
	placeholder?: string;
	label?: string;
	fieldOptions?: RegisterOptions<FieldValues, string>;
}
