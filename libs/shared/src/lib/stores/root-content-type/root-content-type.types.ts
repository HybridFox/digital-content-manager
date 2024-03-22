import { IAPIPagination } from "../../types/paging.types";
import { IContentType, IFetchContentTypesParameters } from "../content-type";

export interface IRootContentTypeStoreState {
	fetchRootContentTypes: (params?: IFetchContentTypesParameters) => Promise<void>;
	rootContentTypes: IContentType[];
	rootContentTypesPagination?: IAPIPagination;
	rootContentTypesLoading: boolean;
	
	enableContentType: (ctId: string, siteId: string) => Promise<void>;
	enableContentTypeLoading: boolean;
	
	disableContentType: (ctId: string, siteId: string) => Promise<void>;
	disableContentTypeLoading: boolean;
}
