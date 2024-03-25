import { IAPIHALResponse, IAPIPagination, IPageParameters } from "../../types/paging.types";

export enum WorkflowTechnicalStates {
	DRAFT = 'DRAFT',
	PUBLISHED = 'PUBLISHED',
	UNPUBLISHED = 'UNPUBLISHED'
}

export interface IWorkflowState {
	id: string;
	name: string;
	slug: string;
	description: string;
	technicalState: WorkflowTechnicalStates;
	internal: boolean;
	removable: boolean;
	deleted: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface IWorkflowTransition {
	id: string;
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
	fetchWorkflows: (siteId: string, params?: IPageParameters) => Promise<void>;
	workflows: IWorkflow[];
	workflowsPagination?: IAPIPagination;
	workflowsLoading: boolean;

	fetchWorkflow: (siteId: string, workflowId: string) => Promise<void>;
	workflow?: IWorkflow,
	workflowLoading: boolean;

	createWorkflow: (siteId: string, workflow: IWorkflowCreateDTO) => Promise<IWorkflow>;
	createWorkflowLoading: boolean;

	updateWorkflow: (siteId: string, workflowId: string, values: IWorkflowUpdateDTO) => Promise<IWorkflow>;
	updateWorkflowLoading: boolean;
}

export interface IUpsertWorkflowTransitionDTO {
	fromWorkflowStateId: string;
	toWorkflowStateId: string;
}

export interface IWorkflowCreateDTO {
	name: string;
	description?: string;
	transitions?: IUpsertWorkflowTransitionDTO[]
}

export interface IWorkflowUpdateDTO {
	name: string;
	description?: string;
	transitions?: IUpsertWorkflowTransitionDTO[]
}
