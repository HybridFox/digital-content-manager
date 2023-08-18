import { SetURLSearchParams } from "react-router-dom";

import { IPageParameters } from "../types";

export const getPageParams = (searchParams: URLSearchParams): IPageParameters => {
	return {
		...(searchParams.get('page') && { page: searchParams.get('page')! }),
		...(searchParams.get('pagesize') && { pagesize: searchParams.get('pagesize')! }),
	}
}


export const getPaginationProps = (searchParams: URLSearchParams, setSearchParams: SetURLSearchParams): { onPageChange: (page: number) => void, onPagesizeChange: (pagesize: number) => void } => {
	const currentSearchParams = [...searchParams.keys()].reduce((acc, key) => ({ ...acc, [key]: searchParams.get(key) }), {});
	return {
		onPageChange: (page) => setSearchParams({ ...currentSearchParams, page: page.toString() }),
		onPagesizeChange: (page) => setSearchParams({ ...currentSearchParams, pagesize: page.toString() }),
	}
}
