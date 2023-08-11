import { IAPIHALResponse, IPageParameters } from "../../types";

export enum STORAGE_KINDS {
	LOCAL_FS = 'LOCAL_FS',
	S3_BUCKET = 'S3_BUCKET'	
}

export interface IStorageRepository {
	id: string;
	name: string;
	kind: STORAGE_KINDS;
	configuration: Record<string, string>;
	updatedAt: string;
	createdAt: string;
}

export type IStorageRepositoriesResponse = IAPIHALResponse<'storageRepositories', IStorageRepository>;

export interface IStorageRepositoryStoreState {
	fetchStorageRepositories: (params?: IPageParameters) => Promise<IStorageRepository[]>;
	storageRepositories: IStorageRepository[];
	storageRepositoriesLoading: boolean;

	fetchStorageRepository: (storageRepositoryId: string) => Promise<IStorageRepository>;
	storageRepository?: IStorageRepository,
	storageRepositoryLoading: boolean;

	createStorageRepository: (storageRepository: IStorageRepositoryCreateDTO) => Promise<IStorageRepository>;
	createStorageRepositoryLoading: boolean;

	updateStorageRepository: (storageRepositoryId: string, values: IStorageRepositoryUpdateDTO) => Promise<IStorageRepository>;
	updateStorageRepositoryLoading: boolean;
}

export interface IStorageRepositoryCreateDTO {
	name: string;
	kind: string;
	configuration: Record<string, string>;
}

export interface IStorageRepositoryUpdateDTO {
	name: string;
	configuration: Record<string, string>;
}
