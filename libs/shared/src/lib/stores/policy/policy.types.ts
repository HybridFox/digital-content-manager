import { IAPIHALResponse, IPageParameters } from "../../types";
import { IPermission } from "../auth";

export interface IPolicy {
	id: string;
	name: string;
	permissions: IPermission[];
	createdAt: string;
	updatedAt: string;
};

export type IPoliciesResponse = IAPIHALResponse<'policies', IPolicy>

export interface IPolicyStoreState {
	fetchPolicies: (siteId: string, params?: IPageParameters) => Promise<void>;
	policies: IPolicy[];
	policiesLoading: boolean;

	fetchPolicy: (siteId: string, workflowId: string) => Promise<void>;
	policy?: IPolicy,
	policyLoading: boolean;

	createPolicy: (siteId: string, policy: IPolicyCreateDTO) => Promise<IPolicy>;
	createPolicyLoading: boolean;

	updatePolicy: (siteId: string, policyId: string, values: IPolicyUpdateDTO) => Promise<IPolicy>;
	updatePolicyLoading: boolean;

	removePolicy: (siteId: string, policyId: string) => Promise<void>;
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
