import { IAPIHALResponse } from "@ibs/shared";

export interface IContentItem {
	id: string;
}

export type IContentResponse = IAPIHALResponse<'content', IContentItem>

export interface IContentStoreState {
	fetchContent: () => Promise<void>;
	content: IContentItem[];
	contentLoading: boolean;

	fetchContentItem: (contentId: string) => Promise<void>;
	contentItem?: IContentItem,
	contentItemLoading: boolean;

	createContentItem: (content: IContentCreateDTO) => Promise<IContentItem>;
	createContentItemLoading: boolean;

	updateContentItem: (contentId: string, values: IContentUpdateDTO) => Promise<IContentItem>;
	updateContentItemLoading: boolean;
}

export interface IContentCreateDTO {
	name: string;
	fields: Record<string, unknown>;
}

export interface IContentUpdateDTO {
	name: string;
	fields: Record<string, unknown>;
}
