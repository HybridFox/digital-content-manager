import { IAPIHALResponse, IPageParameters, IWorkflowState } from "@ibs/shared";

export type IWorkflowStatesResponse = IAPIHALResponse<'workflowStates', IWorkflowState>

export interface IWorkflowStateStoreState {
	fetchWorkflowStates: (params?: IPageParameters) => Promise<void>;
	workflowStates: IWorkflowState[];
	workflowStatesLoading: boolean;

	fetchWorkflowState: (workflowId: string) => Promise<void>;
	workflowState?: IWorkflowState,
	workflowStateLoading: boolean;

	createWorkflowState: (workflowState: IWorkflowStateCreateDTO) => Promise<IWorkflowState>;
	createWorkflowStateLoading: boolean;

	updateWorkflowState: (workflowStateId: string, values: IWorkflowStateUpdateDTO) => Promise<IWorkflowState>;
	updateWorkflowStateLoading: boolean;

	removeWorkflowState: (workflowStateId: string) => Promise<void>;
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
