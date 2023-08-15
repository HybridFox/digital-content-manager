import { IField } from "@ibs/shared";
import { ControllerFieldState, ControllerRenderProps, FieldPath, FieldValues, RegisterOptions, UseFormStateReturn } from "react-hook-form";

export interface IGenericFieldProps {
	name: string;
	label?: string;
	fieldConfiguration?: Record<string, unknown>;
	fieldOptions?: RegisterOptions<FieldValues, string>;
	field?: Partial<IField>;
	disabled?: boolean;
}

export interface IRenderControllerField {
	field: ControllerRenderProps<FieldValues, FieldPath<FieldValues>>;
	fieldState: ControllerFieldState;
	formState: UseFormStateReturn<FieldValues>;
}
