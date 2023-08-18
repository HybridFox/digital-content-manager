import { IRole } from "..";
import { IAPIHALResponse, IAPIPagination, IPageParameters, ISite } from "../../types";

export interface IAuthenticationMethodRoleAssignment {
	id: string;
	siteId?: string;
	roleId: string;
	role: IRole,
	site?: ISite,
}

export type IAuthenticationMethodRoleAssignmentsResponse = IAPIHALResponse<'authenticationMethodRoleAssignments', IAuthenticationMethodRoleAssignment>;

export interface IAuthenticationMethodRoleAssignmentStoreState {
	fetchAuthenticationMethodRoleAssignments: (authenticationMethodId: string, params?: IPageParameters) => Promise<IAuthenticationMethodRoleAssignment[]>;
	authenticationMethodRoleAssignments: IAuthenticationMethodRoleAssignment[];
	authenticationMethodRoleAssignmentsPagination?: IAPIPagination;
	authenticationMethodRoleAssignmentsLoading: boolean;

	fetchAuthenticationMethodRoleAssignment: (authenticationMethodId: string, authenticationMethodRoleAssignmentId: string) => Promise<IAuthenticationMethodRoleAssignment>;
	authenticationMethodRoleAssignment?: IAuthenticationMethodRoleAssignment,
	authenticationMethodRoleAssignmentLoading: boolean;

	createAuthenticationMethodRoleAssignment: (authenticationMethodId: string, authenticationMethodRoleAssignment: IAuthenticationMethodRoleAssignmentCreateDTO) => Promise<IAuthenticationMethodRoleAssignment>;
	createAuthenticationMethodRoleAssignmentLoading: boolean;

	updateAuthenticationMethodRoleAssignment: (authenticationMethodId: string, authenticationMethodRoleAssignmentId: string, values: IAuthenticationMethodRoleAssignmentUpdateDTO) => Promise<IAuthenticationMethodRoleAssignment>;
	updateAuthenticationMethodRoleAssignmentLoading: boolean;

	removeAuthenticationMethodRoleAssignment: (authenticationMethodId: string, authenticationMethodRoleAssignmentId: string) => Promise<void>;
	removeAuthenticationMethodRoleAssignmentLoading: boolean;
}

export interface IAuthenticationMethodRoleAssignmentCreateDTO {
	siteId?: string;
	roleId: string;
}

export interface IAuthenticationMethodRoleAssignmentUpdateDTO {
	siteId?: string;
	roleId: string;
}
