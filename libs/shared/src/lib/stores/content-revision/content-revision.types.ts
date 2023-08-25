import { IUser } from "..";
import { IAPIHALResponse, IAPIPagination, IPageParameters } from "../../types";
import { IWorkflowState } from "../workflow";

export interface IContentRevision {
	id: string;
	workflowStateId: string;
	workflowState: IWorkflowState;
	user: IUser;
	updatedAt: string;
	createdAt: string;
}


export type IContentRevisionsResponse = IAPIHALResponse<'contentRevisions', IContentRevision>

export interface IContentRevisionStoreState {
	fetchContentRevisions: (siteId: string, contentId: string, params?: IPageParameters) => Promise<void>;
	contentRevisions: IContentRevision[];
	contentRevisionsPagination?: IAPIPagination;
	contentRevisionsLoading: boolean;

	fetchContentRevision: (siteId: string, contentId: string, revisionId: string) => Promise<void>;
	contentRevision?: IContentRevision;
	contentRevisionLoading: boolean;

	fetchContentRevisionComparison: (siteId: string, contentId: string, firstRevisionId: string, secondRevisionId: string) => Promise<void>;
	contentRevisionComparison?: [IContentRevision, IContentRevision];
	contentRevisionComparisonLoading: boolean;
}
