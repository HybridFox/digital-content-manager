import { IAPIHALResponse, IPageParameters } from "../../types";
import { IRole } from "../auth";

export type IRolesResponse = IAPIHALResponse<'roles', IRole>

export interface IRoleStoreState {
	fetchRoles: (siteId: string, params?: IPageParameters) => Promise<void>;
	roles: IRole[];
	rolesLoading: boolean;

	fetchRole: (siteId: string, roleId: string) => Promise<void>;
	role?: IRole,
	roleLoading: boolean;

	createRole: (siteId: string, role: IRoleCreateDTO) => Promise<IRole>;
	createRoleLoading: boolean;

	updateRole: (siteId: string, roleId: string, values: IRoleUpdateDTO) => Promise<IRole>;
	updateRoleLoading: boolean;

	removeRole: (siteId: string, roleId: string) => Promise<void>;
	removeRoleLoading: boolean;
}

export interface IRoleCreateDTO {
	name: string;
	description?: string | null;
}

export interface IRoleUpdateDTO {
	name: string;
	description?: string | null;
}
