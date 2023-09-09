import { SetURLSearchParams } from "react-router-dom";
import {omit} from "rambda/immutable";

import { IPageParameters } from "../types";

export const getFilterParams = (searchParams: URLSearchParams): IPageParameters => {
	return {
		...(searchParams.get('page') && { page: searchParams.get('page')! }),
		...(searchParams.get('pagesize') && { pagesize: searchParams.get('pagesize')! }),
	}
}


export const getFilterProps = (searchParams: URLSearchParams, setSearchParams: SetURLSearchParams): { filtering: any, onFiltering: (values: Record<string, string>) => void } => {
	const currentSearchParams = [...searchParams.keys()].reduce((acc, key) => ({ ...acc, [key]: searchParams.get(key) }), {});
	return {
		filtering: omit(['page', 'pagesize'])(currentSearchParams),
		onFiltering: (filterValues) => setSearchParams({ ...currentSearchParams, ...filterValues }),
	}
}
