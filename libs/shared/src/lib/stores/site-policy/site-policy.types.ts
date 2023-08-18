import { IAPIHALResponse, IAPIPagination, IPageParameters } from "../../types";
import { IPolicy } from "../policy";

export type ISitePoliciesResponse = IAPIHALResponse<'sitePolicies', IPolicy>

export interface ISitePolicyStoreState {
	fetchPolicies: (siteId: string, params?: IPageParameters) => Promise<void>;
	policies: IPolicy[];
	policiesPagination?: IAPIPagination;
	policiesLoading: boolean;

	fetchPolicy: (siteId: string, workflowId: string) => Promise<void>;
	policy?: IPolicy,
	policyLoading: boolean;

	createPolicy: (siteId: string, policy: ISitePolicyCreateDTO) => Promise<IPolicy>;
	createPolicyLoading: boolean;

	updatePolicy: (siteId: string, policyId: string, values: ISitePolicyUpdateDTO) => Promise<IPolicy>;
	updatePolicyLoading: boolean;

	removePolicy: (siteId: string, policyId: string) => Promise<void>;
	removePolicyLoading: boolean;
}

export interface ISitePolicyCreateDTO {
	name: string;
	description?: string | null;
}

export interface ISitePolicyUpdateDTO {
	name: string;
	description?: string | null;
}
