import { IAPIHALResponse, IAPIPagination, IPageParameters } from "../../types/paging.types";
import { IContentComponent } from "../content-component";

export enum FIELD_KEYS {
	FIELD_GROUP = 'FIELD_GROUP',
	TEXT = 'TEXT',
	NUMBER = 'NUMBER',
	TEXTAREA = 'TEXTAREA',
	RICH_TEXT = 'RICH_TEXT',
	URL = 'URL',
	SELECT = 'SELECT',
	RADIO = 'RADIO',
	CHECKBOX = 'CHECKBOX',
	MAP = 'MAP',
	MEDIA = 'MEDIA',
	TOGGLE = 'TOGGLE',
	CONTENT_REFERENCE = 'CONTENT_REFERENCE',
	CONTENT_TYPES = 'CONTENT_TYPES',
};

export interface IContentType {
	id: string;
	name: string;
	slug: string;
	workflowId: string;
	kind: ContentTypeKinds;
	createdAt: string;
	updatedAt: string;
	fields: IField[];
}

export interface IField {
	id: string;
	name: string;
	slug: string;
	min: number;
	max: number;
	multiLanguage?: boolean;
	contentComponent: IContentComponent;
	config?: Record<string, string>;
}

export enum ContentTypeKinds {
	CONTENT = 'CONTENT',
	PAGE = 'PAGE',
	CONTENT_BLOCK = 'CONTENT_BLOCK',
}

export const CONTENT_TYPE_KINDS_TRANSLATIONS: Record<ContentTypeKinds, string> = {
	[ContentTypeKinds.CONTENT]: 'Content',
	[ContentTypeKinds.PAGE]: 'Page',
	[ContentTypeKinds.CONTENT_BLOCK]: 'Content Block',
};

export const CONTENT_TYPE_KINDS_PARAMETER_MAP: Record<string, ContentTypeKinds> = {
	content: ContentTypeKinds.CONTENT,
	pages: ContentTypeKinds.PAGE,
	'content-blocks': ContentTypeKinds.CONTENT_BLOCK,
}

export const CONTENT_TYPE_KINDS_OPTIONS: { value: string; label: string }[] = Object.keys(CONTENT_TYPE_KINDS_TRANSLATIONS).map(
	(key: string) => ({
		label: CONTENT_TYPE_KINDS_TRANSLATIONS[key as ContentTypeKinds],
		value: key,
	})
);

export interface IFetchContentTypesParameters extends IPageParameters {
	kind?: ContentTypeKinds
	inludeOccurrences?: boolean;
};

export type IContentTypesResponse = IAPIHALResponse<'contentTypes', IContentType>

export interface IContentTypeStoreState {
	fetchContentTypes: (siteId: string, params?: IFetchContentTypesParameters) => Promise<void>;
	contentTypes: IContentType[];
	contentTypesPagination?: IAPIPagination;
	contentTypesLoading: boolean;

	fetchContentType: (siteId: string, contentTypeId: string) => Promise<IContentType>;
	contentType?: IContentType,
	contentTypeLoading: boolean;

	createContentType: (siteId: string, contentType: IContentTypeCreateDTO) => Promise<IContentType>;
	createContentTypeLoading: boolean;

	updateContentType: (siteId: string, contentTypeId: string, values: IContentTypeUpdateDTO) => Promise<IContentType>;
	updateContentTypeLoading: boolean;
}

export interface IContentTypeCreateDTO {
	name: string;
	description?: string;
}

export interface IContentTypeUpdateDTO {
	name: string;
	description?: string;
}
