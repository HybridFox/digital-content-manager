import { IField } from "@ibs/shared";
import { ReactNode } from "react";

export interface IRenderMultipleProps {
	field: IField;
	children: (index: number) => ReactNode;
	fieldPrefix?: string;
}
