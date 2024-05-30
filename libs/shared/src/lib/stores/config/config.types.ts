export type IConfig = Record<string, string | number>;

export interface IConfigStoreState {
	fetchConfig: () => Promise<void>;
	config?: IConfig,
	configLoading: boolean;

	updateConfig: (values: IConfigUpdateDTO) => Promise<IConfig>;
	updateConfigLoading: boolean;
}

export type IConfigUpdateDTO = Record<string, string | number>;
