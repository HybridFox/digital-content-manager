
export interface ISetupStoreState {
	setup: (values: SetupDTO) => Promise<void>;
}

export interface SetupDTO {
	email: string;
	name: string;
	password: string;
}
