export interface IGenericPageOptions {
	pagesize?: number;
	page?: number;
}

interface IAPIHalLink {
	href: string;
}

export interface IAPIHALResponse<T extends string = string, V = unknown> {
	_embedded: Record<T, V[]>;
	_page: {
		size: number;
		totalElements: number;
		totalPages: number;
		number: number;
	};
	_links: {
		first: IAPIHalLink;
		last: IAPIHalLink;
		prev: IAPIHalLink;
		next: IAPIHalLink;
	};
}

export interface IPageParameters {
	pagesize?: number;
	page?: number
}
