import { IGenericFieldProps } from "../fields.types";

import { TextFieldTypes } from "./text-field.const";

export interface ITextFieldProps extends IGenericFieldProps {
	placeholder?: string;
	type?: `${TextFieldTypes}`;
}
