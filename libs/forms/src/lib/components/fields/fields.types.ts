import { FieldValues, RegisterOptions } from "react-hook-form";

export interface IGenericFieldProps {
	name: string;
	label?: string;
	fieldConfiguration?: Record<string, unknown>;
	fieldOptions?: RegisterOptions<FieldValues, string>;
}
