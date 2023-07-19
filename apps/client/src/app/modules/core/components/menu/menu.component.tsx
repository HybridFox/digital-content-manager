import { NavLink } from "react-router-dom"
import cx from 'classnames/bind'
import { useAuthStore } from "@ibs/shared";

import styles from './menu.module.scss';
const cxBind = cx.bind(styles);

const navLinkBinding = {
	className: ({ isActive, isPending }: { isActive: boolean, isPending: boolean }) => cxBind({
		'o-menu__link': true,
		'o-menu__link--active': isActive,
		'o-menu__link--pending': isPending,
	})
}

export const Menu = () => {
	const { user } = useAuthStore();

	return <div className={cxBind('o-menu')}>
	<div className={cxBind('o-menu__logo')}>
		<i className="las la-sms"></i> Inhoud Beheer Systeem
	</div>
		<div className={cxBind('o-menu__links')}>
			<ul>
				<li>
					<NavLink {...navLinkBinding} to="/app/dashboard"><i className="las la-chart-line"></i> Dashboard</NavLink>
				</li>
				<li>
					<NavLink {...navLinkBinding} to="/app/resources"><i className="las la-photo-video"></i> Resources</NavLink>
				</li>
			</ul>
		</div>
		<div className={cxBind('o-menu__links')}>
			<p className={cxBind('o-menu__links__name')}>Content</p>
			<ul>
				<li>
					<NavLink {...navLinkBinding} to="/app/page-types"><i className="las la-file-invoice"></i> Page Types</NavLink>
				</li>
				<li>
					<NavLink {...navLinkBinding} to="/app/content-types"><i className="las la-book"></i> Content Types</NavLink>
				</li>
				<li>
					<NavLink {...navLinkBinding} to="/app/views"><i className="las la-folder"></i> Views</NavLink>
				</li>
				{/* <li>
					<NavLink {...navLinkBinding} to="/auth"><i className="las la-clipboard-list"></i>Taxonomy</NavLink>
				</li> */}
			</ul>
		</div>
		<div className={cxBind('o-menu__links')}>
			<p className={cxBind('o-menu__links__name')}>Admin</p>
			<ul>
				<li>
					<NavLink {...navLinkBinding} to="/auth"><i className="las la-user"></i>Users</NavLink>
				</li>
				{/* <li>
					<NavLink {...navLinkBinding} to="/auth"><i className="las la-list-alt"></i>Permissions</NavLink>
				</li> */}
				<li>
					<NavLink {...navLinkBinding} to="/auth"><i className="las la-key"></i>Policies</NavLink>
				</li>
				<li>
					<NavLink {...navLinkBinding} to="/auth"><i className="las la-list-alt"></i>Roles</NavLink>
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
}
