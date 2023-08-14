import { IAPIHALResponse, IPageParameters, ISite } from "@ibs/shared";

export type ISitesResponse = IAPIHALResponse<'sites', ISite>

export interface ISiteStoreState {
	fetchSites: (params?: IPageParameters) => Promise<void>;
	sites: ISite[];
	sitesLoading: boolean;

	fetchSite: (workflowId: string) => Promise<void>;
	site?: ISite,
	siteLoading: boolean;

	createSite: (site: ISiteCreateDTO) => Promise<ISite>;
	createSiteLoading: boolean;

	updateSite: (siteId: string, values: ISiteUpdateDTO) => Promise<ISite>;
	updateSiteLoading: boolean;

	removeSite: (siteId: string) => Promise<void>;
	removeSiteLoading: boolean;
}

export interface ISiteCreateDTO {
	name: string;
	description?: string | null;
}

export interface ISiteUpdateDTO {
	name: string;
	description?: string | null;
}
