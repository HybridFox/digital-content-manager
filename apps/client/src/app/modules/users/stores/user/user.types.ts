import { IAPIHALResponse, IPageParameters, IUser } from "@ibs/shared";

export type IUsersResponse = IAPIHALResponse<'users', IUser>

export interface IUserStoreState {
	fetchUsers: (siteId: string, params?: IPageParameters) => Promise<void>;
	users: IUser[];
	usersLoading: boolean;

	fetchUser: (siteId: string, workflowId: string) => Promise<void>;
	user?: IUser,
	userLoading: boolean;

	createUser: (siteId: string, user: IUserCreateDTO) => Promise<IUser>;
	createUserLoading: boolean;

	updateUser: (siteId: string, userId: string, values: IUserUpdateDTO) => Promise<IUser>;
	updateUserLoading: boolean;

	removeUser: (siteId: string, userId: string) => Promise<void>;
	removeUserLoading: boolean;
}

export interface IUserCreateDTO {
	name: string;
	description?: string | null;
}

export interface IUserUpdateDTO {
	name: string;
	description?: string | null;
}
