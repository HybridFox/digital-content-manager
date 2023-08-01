export interface ISite {
	id: string;
	name: string;
	slug: string;
	created_at: string;
	updated_at: string;
	languages: ILanguage[]
}

export interface ILanguage {
	id: string;
	name: string;
	key: string;
}
