import { IAPIHALResponse } from "../../types/paging.types";
import { IContentComponent } from "../content-component";

export interface IContentComponentField {
	id: string,
	name: string,
	slug: string,
	contentComponent: IContentComponent,
	min: number;
	max: number;
	multiLanguage: boolean;
	config: Record<string, string>
}

export type IContentComponentFieldsResponse = IAPIHALResponse<'fields', IContentComponentField>

export interface IContentComponentFieldStoreState {
	fetchFields: (contentComponentId: string) => Promise<void>;
	fields: IContentComponentField[];
	fieldsLoading: boolean;

	fetchField: (contentComponentId: string, fieldId: string) => Promise<void>;
	field?: IContentComponentField,
	fieldLoading: boolean;

	createField: (contentComponentId: string, field: IContentComponentFieldCreateDTO) => Promise<IContentComponentField>;
	createFieldLoading: boolean;

	updateField: (contentComponentId: string, fieldId: string, field: IContentComponentFieldUpdateDTO) => Promise<IContentComponentField>;
	updateFieldLoading: boolean;

	deleteField: (contentComponentId: string, fieldId: string) => Promise<void>;
	deleteFieldLoading: boolean;
}

export interface IContentComponentFieldCreateDTO {
	name: string;
	contentComponentId: string;
}

export interface IContentComponentFieldUpdateDTO {
	name: string;
}
