import { IAPIHALResponse, IAPIPagination, IPageParameters, IWorkflowState } from "~shared";

export type IWorkflowStatesResponse = IAPIHALResponse<'workflowStates', IWorkflowState>

export interface IWorkflowStateStoreState {
	fetchWorkflowStates: (siteId: string, params?: IPageParameters) => Promise<void>;
	workflowStates: IWorkflowState[];
	workflowStatesPagination?: IAPIPagination;
	workflowStatesLoading: boolean;

	fetchWorkflowState: (siteId: string, workflowId: string) => Promise<void>;
	workflowState?: IWorkflowState,
	workflowStateLoading: boolean;

	createWorkflowState: (siteId: string, workflowState: IWorkflowStateCreateDTO) => Promise<IWorkflowState>;
	createWorkflowStateLoading: boolean;

	updateWorkflowState: (siteId: string, workflowStateId: string, values: IWorkflowStateUpdateDTO) => Promise<IWorkflowState>;
	updateWorkflowStateLoading: boolean;

	removeWorkflowState: (siteId: string, workflowStateId: string) => Promise<void>;
	removeWorkflowStateLoading: boolean;
}

export interface IWorkflowStateCreateDTO {
	name: string;
	description?: string | null;
}

export interface IWorkflowStateUpdateDTO {
	name: string;
	description?: string | null;
}
