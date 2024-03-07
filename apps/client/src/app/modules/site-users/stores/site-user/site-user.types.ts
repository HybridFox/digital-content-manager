import { IAPIHALResponse, IAPIPagination, IPageParameters, IUser } from "~shared";

export type ISiteUsersResponse = IAPIHALResponse<'users', IUser>

export interface ISiteUserStoreState {
	fetchUsers: (siteId: string, params?: IPageParameters) => Promise<void>;
	users: IUser[];
	usersPagination?: IAPIPagination;
	usersLoading: boolean;

	fetchUser: (siteId: string, workflowId: string) => Promise<void>;
	user?: IUser,
	userLoading: boolean;

	createUser: (siteId: string, user: ISiteUserCreateDTO) => Promise<IUser>;
	createUserLoading: boolean;

	updateUser: (siteId: string, userId: string, values: ISiteUserUpdateDTO) => Promise<IUser>;
	updateUserLoading: boolean;

	removeUser: (siteId: string, userId: string) => Promise<void>;
	removeUserLoading: boolean;
}

export interface ISiteUserCreateDTO {
	name: string;
	description?: string | null;
}

export interface ISiteUserUpdateDTO {
	roles: string[];
}
