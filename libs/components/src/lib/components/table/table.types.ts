import { ValueOfRecord } from "rambda";
import { ReactNode } from "react";

export interface ITableColumn<T = Record<string, unknown>> {
	id: string;
	label?: string;
	value?: string;
	format?: (value: ValueOfRecord<T>, key: string, item: T, index: number) => ReactNode;
	sticky?: boolean;
	disableSorting?: boolean;
	sort?: string;
	width?: string;
	component?: ReactNode;
}


export interface ITableProps {
	className?: string;
	columns: ITableColumn<any>[];
	rows: Record<any, any>[];
	selectable?: boolean;
	selectablePredicate?: (value: any) => boolean;
	onSelection?: (selection: any[]) => void;
	onOrderChange?: (rows: any[]) => void;
	selection?: any[];
	idKey?: string;
	minSelection?: number;
	maxSelection?: number;
	orderable?: boolean;
	noDataText?: ReactNode;
}
