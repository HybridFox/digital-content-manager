import { SetURLSearchParams } from "react-router-dom";
import {omit} from "rambda/immutable";

import { IPageParameters } from "../types";
import {anyPass, isEmpty, isNil, reject} from "rambda";

export const getFilterParams = (searchParams: URLSearchParams): IPageParameters => {
	const currentSearchParams: Record<string, string> = [...searchParams.keys()].reduce((acc, key) => ({ ...acc, [key]: searchParams.get(key) }), {});
	return Object.keys(currentSearchParams).reduce((acc, filterKey) => {
		if (!filterKey.match(/filter\[([a-z]*)]/)) {
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
			if (!filterKey.match(/filter\[([a-z]*)]/) || !currentSearchParams[filterKey]) {
				return acc;
			}

			return {
				...acc,
				[filterKey.match(/filter\[([a-z]*)]/)?.[1]!]: currentSearchParams[filterKey]
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
