import { IContentItem, IContentType, IField, IWorkflow, IWorkflowState } from "~shared";

export enum ContentFormMode {
	EDIT,
	CREATE
}

export interface IContentFormProps {
	onSubmit: (content: IContentItem) => void;
	mode: ContentFormMode;
	contentItem?: IContentItem;
	workflow?: IWorkflow;
	workflowStates?: IWorkflowState[];
	loading?: boolean;
	fields: IField[];
}
