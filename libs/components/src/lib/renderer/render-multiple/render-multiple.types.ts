import { ReactNode } from "react";

import { FIELD_VIEW_MODE } from "../../../../../forms/src/lib/fields";

import { IField } from "~shared";

export interface IRenderMultipleProps {
	field: IField;
	children: (index: number) => ReactNode;
	fieldPrefix?: string;
	viewMode: FIELD_VIEW_MODE;
}
