import { RouteObject } from "react-router-dom";

export interface IModuleMenuItem {
	to: string;
	icon: string;
	name: string;
}

export interface IModuleMenuGroup {
	name: string;
	items: IModuleMenuItem[];
}

export interface IRegisterModuleOptions {
	name: string;
	routes?: RouteObject[];
	menuGroups?: IModuleMenuGroup[];
}

export interface IModuleHookStoreState {
	menuGroups: IModuleMenuGroup[];
	routes: RouteObject[];
	registerSiteModule: (options: IRegisterModuleOptions) => void;
}
