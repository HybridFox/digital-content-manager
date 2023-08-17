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
	const [permissions] = useAuthStore((state) => [state.permissions]);
	const shouldShow = useMemo(() => {
		return hasPermission(permissions, resource, action);
	}, [siteId, resource, action, permissions])

	if (!shouldShow) {
		return null;
	}

	return (
		<div className={classNames(className)}>
			{children}
		</div>
	);
};
