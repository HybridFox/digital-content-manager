import { ISite } from "../../types/site.types";

export enum PERMISSION_EFFECT {
	GRANT = 'grant',
	DENY = 'deny'
}

export interface IPermission {
	effect: PERMISSION_EFFECT,
	resources: string[];
	actions: string[];
}

export interface IIAMPolicy {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	permissions: IPermission[];
}

export interface IRole {
	id: string;
	name: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
	policies: IIAMPolicy[];
}

export interface IUser {
	id: string;
	name: string;
	email: string;
	avatar: string;
	roles: IRole[];
}

export interface IMeReponse {
	token: string;
	user: IUser;
	sites: ISite[];
}
