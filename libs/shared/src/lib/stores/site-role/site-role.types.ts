import { IAPIHALResponse, IPageParameters } from "../../types";
import { IRole } from "../auth";

export type ISiteRolesResponse = IAPIHALResponse<'siteRoles', IRole>

export interface ISiteRoleStoreState {
	fetchRoles: (siteId: string, params?: IPageParameters) => Promise<void>;
	roles: IRole[];
	rolesLoading: boolean;

	fetchRole: (siteId: string, roleId: string) => Promise<void>;
	role?: IRole,
	roleLoading: boolean;

	createRole: (siteId: string, role: ISiteRoleCreateDTO) => Promise<IRole>;
	createRoleLoading: boolean;

	updateRole: (siteId: string, roleId: string, values: ISiteRoleUpdateDTO) => Promise<IRole>;
	updateRoleLoading: boolean;

	removeRole: (siteId: string, roleId: string) => Promise<void>;
	removeRoleLoading: boolean;
}

export interface ISiteRoleCreateDTO {
	name: string;
	description?: string | null;
}

export interface ISiteRoleUpdateDTO {
	name: string;
	description?: string | null;
}
