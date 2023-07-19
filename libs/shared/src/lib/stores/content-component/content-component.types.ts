import { IAPIHALResponse } from "../../types/paging.types";

export interface IContentComponent {
	id: string;
	name: string;
	slug: string;
	componentName: string;
	createdAt: string;
	updatedAt: string;
}

export type IContentComponentsResponse = IAPIHALResponse<'contentComponents', IContentComponent>
