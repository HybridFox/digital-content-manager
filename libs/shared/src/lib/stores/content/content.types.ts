import { IAPIHALResponse, IAPIPagination, ILanguage, IPageParameters } from "../../types";
import { IWorkflowState } from "../workflow";

export interface IContentItem {
	id: string;
	name: string;
	slug: string;
	translationId: string;
	contentTypeId: string;
	published: boolean;
	kind: string;
	workflowStateId: string;
	fields: Record<string, unknown>;
	language: ILanguage;
	currentWorkflowState: IWorkflowState;
	revisionId: string;
	updatedAt: string;
	createdAt: string;
}

export interface IFetchContentParams {
	translationId?: string
	kind?: string;
	contentTypes?: string[];
}

export type IContentResponse = IAPIHALResponse<'content', IContentItem>;

export interface IContentStoreState {
	fetchContent: (siteId: string, params?: IPageParameters & IFetchContentParams) => Promise<void>;
	content: IContentItem[];
	contentPagination?: IAPIPagination;
	contentLoading: boolean;

	fetchContentItem: (siteId: string, contentId: string) => Promise<IContentItem>;
	contentItem?: IContentItem,
	contentItemLoading: boolean;

	createContentItem: (siteId: string, content: IContentCreateDTO) => Promise<IContentItem>;
	createContentItemLoading: boolean;

	updateContentItem: (siteId: string, contentId: string, values: IContentUpdateDTO) => Promise<IContentItem>;
	updateContentItemLoading: boolean;

	removeContentItem: (siteId: string, contentId: string) => Promise<void>;
	removeContentItemLoading: boolean;

	fetchDefaultValues: (siteId: string, translationId: string) => Promise<IContentItem>;
	defaultValues?: IContentItem,
	defaultValuesLoading: boolean;
}

export interface IContentCreateDTO {
	name: string;
	workflowStateId: string;
	contentTypeId: string;
	languageId: string;
	translationId?: string;
	fields: Record<string, unknown>;
}

export interface IContentUpdateDTO {
	name: string;
	workflowStateId: string;
	contentTypeId: string;
	fields: Record<string, unknown>;
}
