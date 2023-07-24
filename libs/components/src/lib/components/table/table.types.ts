import { ReactNode } from "react";

export interface ITableColumn {
	id: string;
	label?: string;
	value?: string;
	format?: (value: unknown, key: string, item: Record<string, unknown>, index: number) => ReactNode;
	sticky?: boolean;
	disableSorting?: boolean;
	sort?: string;
	width?: string;
	component?: ReactNode;
}


export interface ITableProps {
	className?: string;
	columns: ITableColumn[];
	rows: Record<any, any>[]
}
