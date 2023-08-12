import { IRole, PERMISSION_EFFECT } from "../stores";

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

export const hasPermission = (roles: IRole[], resource: string, action: string): boolean => {
	const [denyList, grantList] = aggregatePermissions(roles);

	const inGrantList = !!grantList.find((permission) => true)

	return inGrantList;
}
