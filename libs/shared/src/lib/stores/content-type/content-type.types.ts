import { IAPIHALResponse } from "../../types/paging.types";

export interface IContentType {
	id: string;
	name: string;
	slug: string;
	componentName: string;
	createdAt: string;
	updatedAt: string;
}

export type IContentTypesResponse = IAPIHALResponse<'contentTypes', IContentType>
