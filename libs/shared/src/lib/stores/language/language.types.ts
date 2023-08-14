import { IAPIHALResponse, ILanguage, IPageParameters } from "../../types";

export type ILanguagesResponse = IAPIHALResponse<'languages', ILanguage>

export interface ILanguageStoreState {
	fetchLanguages: (params?: IPageParameters) => Promise<void>;
	languages: ILanguage[];
	languagesLoading: boolean;

	fetchLanguage: (workflowId: string) => Promise<void>;
	language?: ILanguage,
	languageLoading: boolean;
}
