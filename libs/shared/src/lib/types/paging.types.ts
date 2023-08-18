interface IAPIHalLink {
	href: string;
}

export interface IAPIPagination {
	size: number;
	totalElements: number;
	totalPages: number;
	number: number;
}

export interface IAPIHALResponse<T extends string = string, V = unknown> {
	_embedded: Record<T, V[]>;
	_page: IAPIPagination;
	_links: {
		first: IAPIHalLink;
		last: IAPIHalLink;
		prev: IAPIHalLink;
		next: IAPIHalLink;
	};
}

export interface IPageParameters {
	pagesize?: number | string;
	page?: number | string;
}
