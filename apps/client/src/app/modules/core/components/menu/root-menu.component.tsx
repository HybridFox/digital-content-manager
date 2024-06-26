import { NavLink, generatePath } from 'react-router-dom';
import cx from 'classnames/bind';


import { HasPermission } from '~components';

import { AUTHENTICATION_METHOD_PATHS } from '../../../authentication-methods';
import { SITE_PATHS } from '../../../sites';
import { USER_PATHS } from '../../../users';
import { POLICY_PATHS } from '../../../policies';
import { ROLE_PATHS } from '../../../roles';
import { CONFIG_PATHS } from '../../../config';

import styles from './menu.module.scss';

import { useConfigStore, useStatusStore, useThemeStore } from '~shared';
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
	const [theme] = useThemeStore((state) => [state.theme]);
	const [status] = useStatusStore((state) => [state.status]);
	const [config] = useConfigStore((state) => [state.config]);

	return (
		<div className={cxBind('o-menu')}>
			<div className={cxBind('o-menu__logo')}>
				<NavLink to="/">
					<img src={config?.rootLogoUrl as string || `/assets/img/logo-${theme}.svg`} alt="Logo" className={cxBind('o-menu__logo__image--big')} />
					<img src={config?.rootLogoMobileUrl as string || "/assets/img/logo-icon.svg"} alt="Logo" className={cxBind('o-menu__logo__image--small')} />
				</NavLink>
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
			<HasPermission resource='*' action='root::users:*'>
				<div className={cxBind('o-menu__links')}>
					<p className={cxBind('o-menu__links__name')}>
						<span>User Management</span>
					</p>
					<ul>
						<HasPermission resource='*' action='root::users:read'>
							<li>
								<NavLink {...navLinkBinding} to={generatePath(USER_PATHS.ROOT)}>
									<i className="las la-user"></i>
									<span>Users</span>
								</NavLink>
							</li>
						</HasPermission>
						<HasPermission resource='*' action='root::roles:read'>
							<li>
								<NavLink {...navLinkBinding} to={generatePath(ROLE_PATHS.ROOT)}>
									<i className="las la-list-alt"></i>
									<span>Roles</span>
								</NavLink>
							</li>
						</HasPermission>
						<HasPermission resource='*' action='root::policies:read'>
							<li>
								<NavLink {...navLinkBinding} to={generatePath(POLICY_PATHS.ROOT)}>
									<i className="las la-key"></i>
									<span>Policies</span>
								</NavLink>
							</li>
						</HasPermission>
					</ul>
				</div>
			</HasPermission>
			<HasPermission resource='*' action={['root::authentication-methods:read']}>
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
						<li>
							<NavLink {...navLinkBinding} to={generatePath(CONFIG_PATHS.ROOT)}>
								<i className="las la-cog"></i>
								<span>Config</span>
							</NavLink>
						</li>
					</ul>
				</div>
			</HasPermission>
			<div className={cxBind('o-menu__version')}>
				<span className='las la-cookie'></span>
				<div className={cxBind('o-menu__credits')}>
					<span>by <a href="https://felikx.be" target="_blank" rel="noreferrer">Felikx</a></span>
					<span className={cxBind('o-menu__version-number')}>{('' || 'unknown')?.replace('v', '')} / {(status?.version || 'unknown')?.replace('v', '')}</span>
				</div>
			</div>
		</div>
	);
};
