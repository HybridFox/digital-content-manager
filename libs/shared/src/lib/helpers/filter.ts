import { SetURLSearchParams } from "react-router-dom";
import { anyPass, isEmpty, isNil, reject } from "rambda";

import { IPageParameters } from "../types";

export const getFilterParams = (searchParams: URLSearchParams): IPageParameters => {
	const currentSearchParams: Record<string, string> = [...searchParams.keys()].reduce((acc, key) => ({ ...acc, [key]: searchParams.get(key) }), {});
	return Object.keys(currentSearchParams).reduce((acc, filterKey) => {
		if (!filterKey.match(/filter\[([a-zA-Z]*)]/)) {
			return acc;
		}

		return {
			...acc,
			[filterKey]: currentSearchParams[filterKey]
		}
	}, {})
}


export const getFilterProps = (searchParams: URLSearchParams, setSearchParams: SetURLSearchParams): { filtering: any, onFiltering: (values: Record<string, string>) => void } => {
	const currentSearchParams: Record<string, string> = [...searchParams.keys()].reduce((acc, key) => ({ ...acc, [key]: searchParams.get(key) }), {});
	return {
		filtering: Object.keys(currentSearchParams).reduce((acc, filterKey) => {
			if (!filterKey.match(/filter\[([a-zA-Z]*)]/) || !currentSearchParams[filterKey]) {
				return acc;
			}

			return {
				...acc,
				[filterKey.match(/filter\[([a-zA-Z]*)]/)?.[1]!]: currentSearchParams[filterKey]
			}
		}, {}),
		onFiltering: (filterValues) => setSearchParams(reject(anyPass([isEmpty, isNil]))({ ...currentSearchParams, ...Object.keys(filterValues).reduce((acc, filterKey) => {
			return {
				...acc,
				[`filter[${filterKey}]`]: filterValues[filterKey]
			}
		}, {}) } as any) as unknown as Record<string, string>),
	}
}
