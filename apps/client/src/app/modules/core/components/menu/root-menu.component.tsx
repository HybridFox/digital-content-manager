import { NavLink, generatePath, useParams } from 'react-router-dom';
import cx from 'classnames/bind';
import { useAuthStore } from '@ibs/shared';
import { HasPermission } from '@ibs/components';

import { AUTHENTICATION_METHOD_PATHS } from '../../../authentication-methods';
import { SITE_PATHS } from '../../../sites';
import { USER_PATHS } from '../../../users';
import { POLICY_PATHS } from '../../../policies';
import { ROLE_PATHS } from '../../../roles';

import styles from './menu.module.scss';
const cxBind = cx.bind(styles);

const navLinkBinding = {
	className: ({ isActive, isPending }: { isActive: boolean; isPending: boolean }) =>
		cxBind({
			'o-menu__link': true,
			'o-menu__link--active': isActive,
			'o-menu__link--pending': isPending,
		}),
};

export const RootMenu = () => {
	const { user } = useAuthStore();

	return (
		<div className={cxBind('o-menu')}>
			<div className={cxBind('o-menu__logo')}>
				<i className="las la-sms"></i> <span>Inhoud Beheer Systeem</span>
			</div>
			<div className={cxBind('o-menu__links')}>
				<ul>
					<li>
						<NavLink {...navLinkBinding} to={SITE_PATHS.ROOT}>
							<i className="las la-layer-group"></i>
							<span>Sites</span>
						</NavLink>
					</li>
				</ul>
			</div>
			<div className={cxBind('o-menu__links')}>
				<p className={cxBind('o-menu__links__name')}>
					<span>User Management</span>
				</p>
				<ul>
					<HasPermission resource='*' action='users:*'>
						<li>
							<NavLink {...navLinkBinding} to={generatePath(USER_PATHS.ROOT)}>
								<i className="las la-user"></i>
								<span>Users</span>
							</NavLink>
						</li>
					</HasPermission>
					<HasPermission resource='*' action='roles:*'>
						<li>
							<NavLink {...navLinkBinding} to={generatePath(ROLE_PATHS.ROOT)}>
								<i className="las la-list-alt"></i>
								<span>Roles</span>
							</NavLink>
						</li>
					</HasPermission>
					<HasPermission resource='*' action='policies:*'>
						<li>
							<NavLink {...navLinkBinding} to={generatePath(POLICY_PATHS.ROOT)}>
								<i className="las la-key"></i>
								<span>Policies</span>
							</NavLink>
						</li>
					</HasPermission>
				</ul>
			</div>
			<HasPermission resource='*' action='authentication-methods:*'>
				<div className={cxBind('o-menu__links')}>
					<p className={cxBind('o-menu__links__name')}>
						<span>Administration</span>
					</p>
					<ul>
							<li>
								<NavLink {...navLinkBinding} to={generatePath(AUTHENTICATION_METHOD_PATHS.ROOT)}>
									<i className="las la-server"></i>
									<span>Authentication Methods</span>
								</NavLink>
							</li>
					</ul>
				</div>
			</HasPermission>
		</div>
	);
};
