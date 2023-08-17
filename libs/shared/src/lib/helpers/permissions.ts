import { IPermission, IRole, PERMISSION_EFFECT } from '../stores';
import { ISite } from '../types';

const aggregatePermissions = (roles: IPermission[]): [IPermission[], IPermission[]] => {
	const [denyList, grantList] = roles.reduce(
		([accDenyList, accGrantList], permission) => {
			if (permission.effect === PERMISSION_EFFECT.DENY) {
				return [[...accDenyList, permission], [...accGrantList]];
			}

			return [[...accDenyList], [...accGrantList, permission]];
		},
		[[], []] as [IPermission[], IPermission[]]
	);

	return [denyList, grantList];
};

export const hasPermission = (permissions: IPermission[], resource: string, action: string | string[]): boolean => {
	const [denyList, grantList] = aggregatePermissions(permissions);

	return true;

	// return !!grantList.find((item) => {
	// 	if (Array.isArray(action)) {
	// 		return (
	// 			(!!action.find((a) => new RegExp(item?.actions?.[0]?.replaceAll('*', '(\\w*)')).test(a)) ||
	// 				!!action.find((a) => new RegExp(a.replaceAll('*', '(\\w*)')).test(item?.actions?.[0]))) &&
	// 			(new RegExp(item?.resources?.[0]?.replaceAll('*', '(\\w*)')).test(resource) ||
	// 				new RegExp(resource.replaceAll('*', '(\\w*)')).test(item?.resources?.[0]))
	// 		);
	// 	}

	// 	return (
	// 		(new RegExp(item?.actions?.[0]?.replaceAll('*', '(\\w*)')).test(action) ||
	// 			new RegExp(action.replaceAll('*', '(\\w*)')).test(item?.actions?.[0])) &&
	// 		(new RegExp(item?.resources?.[0]?.replaceAll('*', '(\\w*)')).test(resource) ||
	// 			new RegExp(resource.replaceAll('*', '(\\w*)')).test(item?.resources?.[0]))
	// 	);
	// });
};
