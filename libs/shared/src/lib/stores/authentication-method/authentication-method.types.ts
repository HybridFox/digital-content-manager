import { IAPIHALResponse, IPageParameters } from "../../types";

export enum AUTHENTICATION_METHOD_KINDS {
	LOCAL = 'LOCAL',
	OAUTH2 = 'OAUTH2'
}

export interface IAuthenticationMethod {
	id: string;
	name: string;
	kind: AUTHENTICATION_METHOD_KINDS;
	configuration?: Record<string, string>;
	weight: number;
	active: boolean;
	updatedAt: string;
	createdAt: string;
}

export type IAuthenticationMethodsResponse = IAPIHALResponse<'authenticationMethods', IAuthenticationMethod>;

export interface IAuthenticationMethodStoreState {
	fetchAuthenticationMethods: (params?: IPageParameters) => Promise<IAuthenticationMethod[]>;
	authenticationMethods: IAuthenticationMethod[];
	authenticationMethodsLoading: boolean;

	fetchAuthenticationMethod: (authenticationMethodId: string) => Promise<IAuthenticationMethod>;
	authenticationMethod?: IAuthenticationMethod,
	authenticationMethodLoading: boolean;

	createAuthenticationMethod: (authenticationMethod: IAuthenticationMethodCreateDTO) => Promise<IAuthenticationMethod>;
	createAuthenticationMethodLoading: boolean;

	updateAuthenticationMethod: (authenticationMethodId: string, values: IAuthenticationMethodUpdateDTO) => Promise<IAuthenticationMethod>;
	updateAuthenticationMethodLoading: boolean;
}

export interface IAuthenticationMethodCreateDTO {
	name: string;
	kind: string;
	configuration?: Record<string, string>;
	active: boolean;
	weight: number;
}

export interface IAuthenticationMethodUpdateDTO {
	name: string;
	configuration?: Record<string, string>;
	active: boolean;
	weight: number;
}
