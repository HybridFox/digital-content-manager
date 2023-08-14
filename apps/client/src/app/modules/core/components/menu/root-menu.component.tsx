import { NavLink, generatePath, useParams } from 'react-router-dom';
import cx from 'classnames/bind';
import { useAuthStore } from '@ibs/shared';
import { HasPermission } from '@ibs/components';

import { DASHBOARD_PATHS } from '../../../dashboard';
import { RESOURCE_PATHS } from '../../../resources';
import { CONTENT_PATHS } from '../../../content/content.routes';
import { CONTENT_TYPES_PATHS } from '../../../content-types';
import { CONTENT_COMPONENT_PATHS } from '../../../content-components';
import { WORKFLOW_PATHS } from '../../../workflow';
import { USER_PATHS } from '../../../users';
import { ROLE_PATHS } from '../../../roles';
import { POLICY_PATHS } from '../../../policies';
import { STORAGE_PATHS } from '../../../storage';
import { AUTHENTICATION_METHOD_PATHS } from '../../../authentication-methods';
import { SITE_PATHS } from '../../../sites';

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
	const { siteId } = useParams();

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
					<li>
						<NavLink {...navLinkBinding} to={generatePath(AUTHENTICATION_METHOD_PATHS.ROOT)}>
							<i className="las la-server"></i>
							<span>Authentication Methods</span>
						</NavLink>
					</li>
				</ul>
			</div>
		</div>
	);
};
