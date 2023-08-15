import { NavLink } from 'react-router-dom';
import cx from 'classnames/bind';
import { useAuthStore } from '@ibs/shared';

import { Avatar } from '../avatar/avatar.component';

import styles from './top-bar.module.scss';
const cxBind = cx.bind(styles);

const navLinkBinding = {
	className: ({ isActive, isPending }: { isActive: boolean; isPending: boolean }) =>
		cxBind({
			'o-top-bar__link': true,
			'o-top-bar__link--active': isActive,
			'o-top-bar__link--pending': isPending,
		}),
};

export const TopBar = () => {
	const { user } = useAuthStore();

	return (
		<div className={cxBind('o-top-bar')}>
			<div className={cxBind('o-top-bar__links')}>
				<ul>
					<li>
						<NavLink {...navLinkBinding} to=''>
							<i className="las la-question-circle"></i>
						</NavLink>
					</li>
					<li>
						<NavLink {...navLinkBinding} to=''>
							<i className="las la-bell"></i>
						</NavLink>
					</li>
				</ul>
			</div>
			<div className={cxBind('o-top-bar__profile')}>
				<Avatar src={user?.avatar} fallbackName={user?.name || ''} /> 
				<div className={cxBind('o-top-bar__profile__info')}>
					<p className={cxBind('o-top-bar__profile__name')}>{user?.name}</p>
					<p className={cxBind('o-top-bar__profile__email')}>{user?.email}</p>
				</div>
				{/* <NavLink {...navLinkBinding} to="/" className={cxBind('o-top-bar__profile__settings')}>
					<i className="las la-ellipsis-h"></i>
				</NavLink> */}
			</div>
		</div>
	);
};
