import { ControllerFieldState, ControllerRenderProps, FieldPath, FieldValues, RegisterOptions, UseFormStateReturn } from "react-hook-form";

import { IField } from "~shared";

export enum FieldViewMode {
	EDIT = 'EDIT',
	VIEW = 'VIEW',
	DIFF = 'DIFF'
}

export interface IGenericFieldProps {
	name: string;
	label?: string;
	fieldConfiguration?: Record<string, unknown>;
	fieldOptions?: RegisterOptions<FieldValues, string>;
	field?: Partial<IField>;
	disabled?: boolean;
	siteId?: string;
	viewMode?: FieldViewMode;
}

export interface IRenderControllerField {
	field: ControllerRenderProps<FieldValues, FieldPath<FieldValues>>;
	fieldState: ControllerFieldState;
	formState: UseFormStateReturn<FieldValues>;
}
