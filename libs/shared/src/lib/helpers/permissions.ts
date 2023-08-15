import { IRole, PERMISSION_EFFECT } from "../stores";
import { ISite } from "../types";

interface IAggregatedPermission {
	resource: string;
	action: string;
}

const aggregatePermissions = (roles: IRole[]): [IAggregatedPermission[], IAggregatedPermission[]] => {
	const [denyList, grantList] = roles.reduce(([accDenyList, accGrantList], role) => {
		const [subDenyList, subGrantList] = role.policies.reduce(([accSubDenyList, accSubGrantList], policy) => {
			const dl = policy.permissions.filter((permission) => permission.effect === PERMISSION_EFFECT.DENY).reduce((permissionAcc, permission) => [...permissionAcc, {
				resource: permission.resources[0],
				action: permission.actions[0],
			}], [] as IAggregatedPermission[]);
			const gl = policy.permissions.filter((permission) => permission.effect === PERMISSION_EFFECT.GRANT).reduce((permissionAcc, permission) => [...permissionAcc, {
				resource: permission.resources[0],
				action: permission.actions[0],
			}], [] as IAggregatedPermission[]);

			return [
				[...accSubDenyList, ...dl],
				[...accSubGrantList, ...gl]
			];
		}, [[], []] as [IAggregatedPermission[], IAggregatedPermission[]]);

		return [
			[...accDenyList, ...subDenyList],
			[...accGrantList, ...subGrantList]
		]
	}, [[], []] as [IAggregatedPermission[], IAggregatedPermission[]]);

	return [denyList, grantList];
}

export const hasPermission = (siteId: string | undefined, sites: ISite[], roles: IRole[], resource: string, action: string | string[]): boolean => {
	let rolesToCheck = [];
	if (siteId) {
		const site = sites.find((site) => site.id === siteId);
		rolesToCheck = site?.roles || [];
	} else {
		rolesToCheck = roles;
	}

	const [denyList, grantList] = aggregatePermissions(rolesToCheck);


	return !!grantList.find((item) => {
		if (Array.isArray(action)) {
			return (!!action.find((a) => new RegExp(item?.action?.replaceAll('*', "(\\w*)")).test(a)) || !!action.find((a) => new RegExp(a.replaceAll('*', "(\\w*)")).test(item?.action))) 
				&& (new RegExp(item?.resource?.replaceAll('*', "(\\w*)")).test(resource) || new RegExp(resource.replaceAll('*', "(\\w*)")).test(item?.resource));
		}

		return (new RegExp(item?.action?.replaceAll('*', "(\\w*)")).test(action) || new RegExp(action.replaceAll('*', "(\\w*)")).test(item?.action)) 
			&& (new RegExp(item?.resource?.replaceAll('*', "(\\w*)")).test(resource) || new RegExp(resource.replaceAll('*', "(\\w*)")).test(item?.resource));
	});
}
