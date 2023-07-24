import { FieldValues, RegisterOptions } from "react-hook-form";

import { TextInputTypes } from "./text-input.const";

export interface ITextInputProps {
	name: string;
	placeholder?: string;
	label?: string;
	type?: `${TextInputTypes}`;
	fieldOptions?: RegisterOptions<FieldValues, string>;
}
