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
import { SITE_USER_PATHS } from '../../../site-users';
import { SITE_ROLE_PATHS } from '../../../site-roles';
import { SITE_POLICY_PATHS } from '../../../site-policies';
import { STORAGE_PATHS } from '../../../storage';

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

export const Menu = () => {
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
						<NavLink {...navLinkBinding} to={generatePath(DASHBOARD_PATHS.ROOT, { siteId })}>
							<i className="las la-chart-line"></i>
							<span>Dashboard</span>
						</NavLink>
					</li>
					<li>
						{/* <HasPermission action='resources/read' resource='*'> */}
							<NavLink {...navLinkBinding} to={generatePath(RESOURCE_PATHS.ROOT, { siteId })}>
								<i className="las la-photo-video"></i>
								<span>Resources</span>
							</NavLink>
						{/* </HasPermission> */}
					</li>
				</ul>
			</div>
			<div className={cxBind('o-menu__links')}>
				<p className={cxBind('o-menu__links__name')}>
					<span>Content</span>
				</p>
				<ul>
					<li>
						<NavLink {...navLinkBinding} to={generatePath(CONTENT_PATHS.ROOT, { siteId, kind: 'content' })}>
							<i className="las la-th-list"></i>
							<span>Content</span>
						</NavLink>
					</li>
					<li>
						<NavLink {...navLinkBinding} to={generatePath(CONTENT_PATHS.ROOT, { siteId, kind: 'page' })}>
							<i className="las la-file"></i>
							<span>Pages</span>
						</NavLink>
					</li>
					<li>
						<NavLink {...navLinkBinding} to={generatePath(CONTENT_PATHS.ROOT, { siteId, kind: 'content-block' })}>
							<i className="las la-cubes"></i>
							<span>Blocks</span>
						</NavLink>
					</li>
				</ul>
			</div>
			<div className={cxBind('o-menu__links')}>
				<p className={cxBind('o-menu__links__name')}>
					<span>Management</span>
				</p>
				<ul>
					{/* <li>
					<NavLink {...navLinkBinding} to="/app/page-types"><i className="las la-file-invoice"></i> Page Types</NavLink>
				</li> */}
					<li>
						<NavLink {...navLinkBinding} to={generatePath(CONTENT_TYPES_PATHS.ROOT, { siteId })}>
							<i className="las la-book"></i>
							<span>Content Types</span>
						</NavLink>
					</li>
					<li>
						<NavLink {...navLinkBinding} to={generatePath(CONTENT_COMPONENT_PATHS.ROOT, { siteId })}>
							<i className="las la-puzzle-piece"></i>
							<span>Content Components</span>
						</NavLink>
					</li>
					<li>
						<NavLink {...navLinkBinding} to={generatePath(WORKFLOW_PATHS.WORKFLOWS_ROOT, { siteId })}>
							<i className="las la-sitemap"></i>
							<span>Workflows</span>
						</NavLink>
					</li>
					<li>
						<NavLink {...navLinkBinding} to={generatePath(WORKFLOW_PATHS.WORKFLOW_STATES_ROOT, { siteId })}>
							<i className="las la-sliders-h"></i>
							<span>Workflow States</span>
						</NavLink>
					</li>
					{/* <li>
					<NavLink {...navLinkBinding} to="/app/views"><i className="las la-folder"></i> Views</NavLink>
				</li> */}
					{/* <li>
					<NavLink {...navLinkBinding} to="/auth"><i className="las la-clipboard-list"></i>Taxonomy</NavLink>
				</li> */}
				</ul>
			</div>
			<div className={cxBind('o-menu__links')}>
				<p className={cxBind('o-menu__links__name')}>
					<span>Admin</span>
				</p>
				<ul>
					<li>
						<NavLink {...navLinkBinding} to={generatePath(SITE_USER_PATHS.ROOT, { siteId })}>
							<i className="las la-user"></i>
							<span>Users</span>
						</NavLink>
					</li>
					{/* <li>
					<NavLink {...navLinkBinding} to="/auth"><i className="las la-list-alt"></i>Permissions</NavLink>
				</li> */}
					<li>
						<NavLink {...navLinkBinding} to={generatePath(SITE_ROLE_PATHS.ROOT, { siteId })}>
							<i className="las la-list-alt"></i>
							<span>Roles</span>
						</NavLink>
					</li>
					<li>
						<NavLink {...navLinkBinding} to={generatePath(SITE_POLICY_PATHS.ROOT, { siteId })}>
							<i className="las la-key"></i>
							<span>Policies</span>
						</NavLink>
					</li>
					<li>
						<NavLink {...navLinkBinding} to={generatePath(STORAGE_PATHS.ROOT, { siteId })}>
							<i className="las la-server"></i>
							<span>Storage</span>
						</NavLink>
					</li>
					{/* <li>
					<NavLink {...navLinkBinding} to="/auth"><i className="las la-invoice"></i>Languages</NavLink>
				</li>
				<li>
					<NavLink {...navLinkBinding} to="/auth"><i className="las la-invoice"></i>Workflows</NavLink>
				</li> */}
				</ul>
			</div>
			<div className={cxBind('o-menu__profile')}>
				<img src={user?.avatar} alt="avatar" className={cxBind('o-menu__profile__avatar')} />
				<div className={cxBind('o-menu__profile__info')}>
					<p className={cxBind('o-menu__profile__name')}>{user?.name}</p>
					<p className={cxBind('o-menu__profile__email')}>{user?.email}</p>
				</div>
				<NavLink {...navLinkBinding} to="/" className={cxBind('o-menu__profile__settings')}>
					<i className="las la-ellipsis-h"></i>
				</NavLink>
			</div>
		</div>
	);
};
