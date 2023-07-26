import { IAPIHALResponse } from "../../types/paging.types";
import { FIELD_KEYS, IField } from "../content-type";

export interface IContentComponent {
	id: string;
	name: string;
	slug: string;
	componentName: FIELD_KEYS;
	configurationFields: IField[];
	subFields: IField[];
	createdAt: string;
	updatedAt: string;
}

export type IContentComponentsResponse = IAPIHALResponse<'contentComponents', IContentComponent>
