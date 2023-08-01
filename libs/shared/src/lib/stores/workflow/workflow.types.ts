import { IAPIHALResponse, IPageParameters } from "../../types/paging.types";

export interface IWorkflowState {
	id: string;
	name: string;
	slug: string;
	description: string;
	technicalState: string;
	internal: boolean;
	removable: boolean;
	deleted: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface IWorkflowTransition {
	fromState: IWorkflowState;
	toState: IWorkflowState;
}

export interface IWorkflow {
	id: string;
	name: string;
	slug: string;
	defaultWorkflowStateId: string;
	internal: boolean;
	removable: boolean;
	active: boolean;
	deleted: boolean;
	createdAt: string;
	updatedAt: string;
	transitions: IWorkflowTransition[];
}

export type IWorkflowsResponse = IAPIHALResponse<'workflows', IWorkflow>

export interface IWorkflowStoreState {
	fetchWorkflows: (params?: IPageParameters) => Promise<void>;
	workflows: IWorkflow[];
	workflowsLoading: boolean;

	fetchWorkflow: (workflowId: string) => Promise<void>;
	workflow?: IWorkflow,
	workflowLoading: boolean;

	createWorkflow: (workflow: IWorkflowCreateDTO) => Promise<IWorkflow>;
	createWorkflowLoading: boolean;

	updateWorkflow: (workflowId: string, values: IWorkflowUpdateDTO) => Promise<IWorkflow>;
	updateWorkflowLoading: boolean;
}

export interface IWorkflowCreateDTO {
	name: string;
	description?: string;
}

export interface IWorkflowUpdateDTO {
	name: string;
	description?: string;
}
