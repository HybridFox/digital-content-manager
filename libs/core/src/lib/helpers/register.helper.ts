import { IRegisterModuleOptions, useModuleHookStore } from "../stores";

export const registerSiteModule = (options: IRegisterModuleOptions): void => {
	useModuleHookStore.getState().registerSiteModule(options);
}
