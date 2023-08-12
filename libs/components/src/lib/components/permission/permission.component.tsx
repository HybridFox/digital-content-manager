import { FC, useMemo } from 'react';
import classNames from 'classnames';
import { hasPermission, useAuthStore } from '@ibs/shared';

import { IPermissionProp } from './permission.types';

export const HasPermission: FC<IPermissionProp> = ({
	className,
	children,
	resource,
	action
}: IPermissionProp) => {
	const [activeSite] = useAuthStore((state) => [state.activeSite]);

	const shouldShow = useMemo(() => {
		if (!activeSite) {
			return false;
		}

		return hasPermission(activeSite.roles, resource, action);
	}, [activeSite, resource, action])

	if (!shouldShow) {
		return null;
	}

	return (
		<div className={classNames(className)}>
			{children}
		</div>
	);
};
