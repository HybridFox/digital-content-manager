import { IAPIHALResponse, IPageParameters, PERMISSION_EFFECT } from "@ibs/shared";

export interface IPermission {
	effect: PERMISSION_EFFECT;
	resources: string[];
	actions: string[];
}

export interface IPolicy {
	id: string;
	name: string;
	permissions: IPermission[];
	createdAt: string;
	updatedAt: string;
};

export type IPoliciesResponse = IAPIHALResponse<'policies', IPolicy>

export interface IPolicyStoreState {
	fetchPolicies: (params?: IPageParameters) => Promise<void>;
	policies: IPolicy[];
	policiesLoading: boolean;

	fetchPolicy: (workflowId: string) => Promise<void>;
	policy?: IPolicy,
	policyLoading: boolean;

	createPolicy: (policy: IPolicyCreateDTO) => Promise<IPolicy>;
	createPolicyLoading: boolean;

	updatePolicy: (policyId: string, values: IPolicyUpdateDTO) => Promise<IPolicy>;
	updatePolicyLoading: boolean;

	removePolicy: (policyId: string) => Promise<void>;
	removePolicyLoading: boolean;
}

export interface IPolicyCreateDTO {
	name: string;
	description?: string | null;
}

export interface IPolicyUpdateDTO {
	name: string;
	description?: string | null;
}
