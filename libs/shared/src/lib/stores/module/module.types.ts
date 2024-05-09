import { IAPIHALResponse, IAPIPagination, IPageParameters } from "../../types";

export interface IModule {
	id: string;
	name: string;
	entryUrl: string;
	active: boolean;
}

interface IFetchModulesParameters extends IPageParameters {
	all?: boolean;
}

export type IModulesResponse = IAPIHALResponse<'modules', IModule>;

export interface IModuleStoreState {
	fetchModules: (siteId: string, params?: IFetchModulesParameters) => Promise<IModule[]>;
	modules: IModule[];
	modulesPagination?: IAPIPagination;
	modulesLoading: boolean;

	fetchModule: (siteId: string, moduleId: string) => Promise<IModule>;
	module?: IModule,
	moduleLoading: boolean;

	createModule: (siteId: string, module: IModuleCreateDTO) => Promise<IModule>;
	createModuleLoading: boolean;

	updateModule: (siteId: string, moduleId: string, values: IModuleUpdateDTO) => Promise<IModule>;
	updateModuleLoading: boolean;

	removeModule: (siteId: string, moduleId: string) => Promise<void>;
	removeModuleLoading: boolean;
}

export interface IModuleCreateDTO {
	name: string;
	entryUrl: string;
	active: boolean;
}

export interface IModuleUpdateDTO {
	name?: string;
	entryUrl?: string;
	active?: boolean;
}
