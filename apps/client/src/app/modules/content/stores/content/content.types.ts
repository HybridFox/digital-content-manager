import { IAPIHALResponse, ILanguage, IPageParameters } from "@ibs/shared";

export interface IContentItem {
	id: string;
	name: string;
	slug: string;
	translationId: string;
	contentTypeId: string;
	kind: string;
	workflowStateId: string;
	fields: Record<string, unknown>;
	language: ILanguage;
	updatedAt: string;
	createdAt: string;
}

export interface IFetchContentParams {
	translationId?: string
	kind?: string;
}

export type IContentResponse = IAPIHALResponse<'content', IContentItem>;

export interface IContentStoreState {
	fetchContent: (params?: IPageParameters & IFetchContentParams) => Promise<void>;
	content: IContentItem[];
	contentLoading: boolean;

	fetchContentItem: (contentId: string) => Promise<IContentItem>;
	contentItem?: IContentItem,
	contentItemLoading: boolean;

	createContentItem: (content: IContentCreateDTO) => Promise<IContentItem>;
	createContentItemLoading: boolean;

	updateContentItem: (contentId: string, values: IContentUpdateDTO) => Promise<IContentItem>;
	updateContentItemLoading: boolean;
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
