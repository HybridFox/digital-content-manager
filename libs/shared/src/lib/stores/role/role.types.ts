import { IAPIHALResponse, IPageParameters } from "../../types";
import { IRole } from "../auth";

export type IRolesResponse = IAPIHALResponse<'roles', IRole>

export interface IRoleStoreState {
	fetchRoles: (params?: IPageParameters) => Promise<void>;
	roles: IRole[];
	rolesLoading: boolean;

	fetchRole: (roleId: string) => Promise<void>;
	role?: IRole,
	roleLoading: boolean;

	createRole: (role: IRoleCreateDTO) => Promise<IRole>;
	createRoleLoading: boolean;

	updateRole: (roleId: string, values: IRoleUpdateDTO) => Promise<IRole>;
	updateRoleLoading: boolean;

	removeRole: (roleId: string) => Promise<void>;
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
