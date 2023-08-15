import { IAPIHALResponse, IPageParameters } from "../../types";

export interface IIAMAction {
	key: string;
	description: string;
	active: boolean;
	deprecated: boolean;
};

export type IIAMActionsResponse = IAPIHALResponse<'iamActions', IIAMAction>;

interface IFetchIAMActionsParams extends IPageParameters {
	kind?: string;
}

export interface IIAMActionStoreState {
	fetchIAMActions: (params?: IFetchIAMActionsParams) => Promise<void>;
	iamActions: IIAMAction[];
	iamActionsLoading: boolean;

	fetchIAMAction: (workflowId: string) => Promise<void>;
	iamAction?: IIAMAction,
	iamActionLoading: boolean;
}
