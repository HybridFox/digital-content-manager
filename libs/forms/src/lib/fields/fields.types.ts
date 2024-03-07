import { ControllerFieldState, ControllerRenderProps, FieldPath, FieldValues, RegisterOptions, UseFormStateReturn } from "react-hook-form";

import { IField } from "~shared";

export enum FIELD_VIEW_MODE {
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
	viewMode?: FIELD_VIEW_MODE;
}

export interface IRenderControllerField {
	field: ControllerRenderProps<FieldValues, FieldPath<FieldValues>>;
	fieldState: ControllerFieldState;
	formState: UseFormStateReturn<FieldValues>;
}
