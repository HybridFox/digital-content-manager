import {FIELD_KEYS} from "@ibs/shared";

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
	contentComponent: FIELD_KEYS;
	config?: Record<string, unknown>;
}
