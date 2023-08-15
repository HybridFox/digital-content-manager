import { FC, useMemo } from 'react';
import classNames from 'classnames';
import { hasPermission, useAuthStore } from '@ibs/shared';

import { IPermissionProp } from './permission.types';

export const HasPermission: FC<IPermissionProp> = ({
	className,
	children,
	resource,
	action,
	siteId
}: IPermissionProp) => {
	const [sites, roles] = useAuthStore((state) => [state.sites, state.roles]);
	const shouldShow = useMemo(() => {
		return hasPermission(siteId, sites, roles, resource, action);
	}, [siteId, resource, action, sites, roles])

	if (!shouldShow) {
		return null;
	}

	return (
		<div className={classNames(className)}>
			{children}
		</div>
	);
};
