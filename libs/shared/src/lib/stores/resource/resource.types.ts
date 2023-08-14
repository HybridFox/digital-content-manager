import { IAPIHALResponse, IPageParameters } from "../../types";

export enum ResourceKind {
	DIRECTORY = 'DIRECTORY',
	FILE = 'FILE'
}

export interface IResource {
	name: string;
	kind: ResourceKind;
	updatedAt: string;
	createdAt: string;
}

export interface IFetchResourcesParams {
	path: string;
}

export type IResourcesResponse = IAPIHALResponse<'resources', IResource>;

export interface IResourceStoreState {
	fetchResources: (siteId: string, contentRepositoryId: string, params: IPageParameters & IFetchResourcesParams) => Promise<void>;
	resources: IResource[];
	resourcesLoading: boolean;

	createDirectory: (siteId: string, contentRepositoryId: string, path: string, name: string) => Promise<void>;
	createDirectoryLoading: boolean;

	removeDirectory: (siteId: string, contentRepositoryId: string, path: string, name: string) => Promise<void>;
	removeDirectoryLoading: boolean;

	uploadFile: (siteId: string, contentRepositoryId: string, path: string, file: File) => Promise<void>;
	uploadFileLoading: boolean;

	// fetchResource: (contentId: string) => Promise<IResource>;
	// resource?: IResource,
	// resourceLoading: boolean;

	// createResource: (content: IResourceCreateDTO) => Promise<IResource>;
	// createResourceLoading: boolean;

	// updateResource: (contentId: string, values: IResourceUploadFileDTO) => Promise<IResource>;
	// updateResourceLoading: boolean;
}

export interface IResourceCreateFolderDTO {
	name: string;
}

export interface IResourceUploadFileDTO {
	name: string;
	workflowStateId: string;
	contentTypeId: string;
	fields: Record<string, unknown>;
}
