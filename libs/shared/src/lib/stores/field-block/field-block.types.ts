import { IAPIHALResponse, IAPIPagination, IPageParameters } from "../../types/paging.types";
import { IContentComponent } from "../content-component";

export interface IFieldBlock {
	id: string;
	name: string;
	slug: string;
	contentComponent: IContentComponent;
	min: number;
	max: number;
	multiLanguage: boolean;
	config: Record<string, string>;
	validation: any;
}

export type IFieldBlocksResponse = IAPIHALResponse<'blocks', IFieldBlock>

export interface IFieldBlockStoreState {
	fetchFields: (siteId: string, contentTypeId: string, fieldId: string, params: IPageParameters) => Promise<void>;
	fields: IFieldBlock[];
	fieldsPagination?: IAPIPagination;
	fieldsLoading: boolean;

	fetchField: (siteId: string, contentTypeId: string, fieldId: string, blockId: string) => Promise<void>;
	field?: IFieldBlock,
	fieldLoading: boolean;

	createField: (siteId: string, contentTypeId: string, fieldId: string, block: IFieldBlockCreateDTO) => Promise<IFieldBlock>;
	createFieldLoading: boolean;

	updateField: (siteId: string, contentTypeId: string, fieldId: string, blockId: string, block: IFieldBlockUpdateDTO) => Promise<IFieldBlock>;
	updateFieldLoading: boolean;

	deleteField: (siteId: string, contentTypeId: string, fieldId: string, blockId: string) => Promise<void>;
	deleteFieldLoading: boolean;
}

export interface IFieldBlockCreateDTO {
	name: string;
	contentComponentId: string;
}

export interface IFieldBlockUpdateDTO {
	name: string;
}

export interface IFieldBlockOrderUpdateDTO {
	compartmentId?: string;
	sequenceNumber?: number;
	id?: string;
}
