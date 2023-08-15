import { IAPIHALResponse, IPageParameters, ISite, IUser } from "@ibs/shared";

export type IUsersResponse = IAPIHALResponse<'users', IUser>

export interface IUserStoreState {
	fetchUsers: (params?: IPageParameters) => Promise<void>;
	users: IUser[];
	usersLoading: boolean;

	fetchUser: (siteID: string) => Promise<void>;
	user?: IUser,
	userLoading: boolean;

	createUser: (user: IUserCreateDTO) => Promise<IUser>;
	createUserLoading: boolean;

	updateUser: (userId: string, values: IUserUpdateDTO) => Promise<IUser>;
	updateUserLoading: boolean;

	removeUser: (userId: string) => Promise<void>;
	removeUserLoading: boolean;

	fetchUserSites: (userId: string, params?: IPageParameters) => Promise<void>;
	userSites: ISite[];
	userSitesLoading: boolean;
}

export interface IUserCreateDTO {
	name: string;
	description?: string | null;
}

export interface IUserUpdateDTO {
	roles: string[];
}
