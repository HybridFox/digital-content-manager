import { ITableGroup } from "../../table.types";

export enum ChangeGroupLocation {
	START,
	END
}

export interface ITableOrderProps {
	onOrder: (row: Record<any, any>, newIndex: number) => void;
	onChangeGroup: (row: Record<any, any>, newGroupId: string, location: ChangeGroupLocation) => void;
	currentIndex: number;
	totalRows: number;
	groups?: ITableGroup[];
	currentGroupId?: string;
	row: Record<any, any>;
}

