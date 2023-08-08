import { IAPIHALResponse, ILanguage, IPageParameters } from "@ibs/shared";

export interface IResource {
	id: string;
	name: string;
	slug: string;
	translationId: string;
	contentTypeId: string;
	kind: string;
	workflowStateId: string;
	fields: Record<string, unknown>;
	language: ILanguage;
	updatedAt: string;
	createdAt: string;
}

export interface IFetchResourcesParams {
	translationId?: string
	kind?: string;
}

export type IResourcesResponse = IAPIHALResponse<'resources', IResource>;

export interface IResourceStoreState {
	fetchResources: (params?: IPageParameters & IFetchResourcesParams) => Promise<void>;
	resources: IResource[];
	resourcesLoading: boolean;

	fetchResource: (contentId: string) => Promise<IResource>;
	resource?: IResource,
	resourceLoading: boolean;

	createResource: (content: IResourceCreateDTO) => Promise<IResource>;
	createResourceLoading: boolean;

	updateResource: (contentId: string, values: IResourceUpdateDTO) => Promise<IResource>;
	updateResourceLoading: boolean;
}

export interface IResourceCreateDTO {
	name: string;
	workflowStateId: string;
	contentTypeId: string;
	languageId: string;
	translationId?: string;
	fields: Record<string, unknown>;
}

export interface IResourceUpdateDTO {
	name: string;
	workflowStateId: string;
	contentTypeId: string;
	fields: Record<string, unknown>;
}
