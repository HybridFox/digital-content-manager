import { IAPIHALResponse, IPageParameters } from "@ibs/shared";

export interface IIAMAction {
	key: string;
	description: string;
	active: boolean;
	deprecated: boolean;
};

export type IIAMActionsResponse = IAPIHALResponse<'iamActions', IIAMAction>

export interface IIAMActionStoreState {
	fetchIAMActions: (params?: IPageParameters) => Promise<void>;
	iamActions: IIAMAction[];
	iamActionsLoading: boolean;

	fetchIAMAction: (workflowId: string) => Promise<void>;
	iamAction?: IIAMAction,
	iamActionLoading: boolean;
}
