import { IAPIHALResponse, IAPIPagination, IPageParameters } from "../../types";

export enum AuthenticationMethod {
	LOCAL = 'LOCAL',
	OAUTH2 = 'OAUTH2'
}

export interface IAuthenticationMethod {
	id: string;
	name: string;
	kind: AuthenticationMethod;
	configuration?: Record<string, string>;
	weight: number;
	active: boolean;
	updatedAt: string;
	createdAt: string;
}

interface IFetchAuthenticationMethodsParameters extends IPageParameters {
	all?: boolean;
}

export type IAuthenticationMethodsResponse = IAPIHALResponse<'authenticationMethods', IAuthenticationMethod>;

export interface IAuthenticationMethodStoreState {
	fetchAuthenticationMethods: (params?: IFetchAuthenticationMethodsParameters) => Promise<IAuthenticationMethod[]>;
	authenticationMethods: IAuthenticationMethod[];
	authenticationMethodsPagination?: IAPIPagination;
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
