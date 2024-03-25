import {FieldKeys} from "~shared";

export interface IFiltersProps {
	className?: string;
	onFiltering: (filters: any) => void;
	filtering: any;
	filters: IFiltersFilter[];
	siteId: string;
}

export interface IFiltersFilter {
	name: string;
	slug: string;
	contentComponent: FieldKeys;
	config?: Record<string, unknown>;
}
