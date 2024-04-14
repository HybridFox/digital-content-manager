import { ReactNode } from "react";

import { FieldViewMode } from "../../fields";

import { IField } from "~shared";

export interface IRenderMultipleProps {
	field: IField;
	children: (index: number) => ReactNode;
	fieldPrefix?: string;
	viewMode: FieldViewMode;
	errors?: any;
}
