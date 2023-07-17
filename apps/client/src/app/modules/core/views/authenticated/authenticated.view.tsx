import { Outlet } from "react-router-dom"
import cx from 'classnames/bind';

import { Menu } from "../../components/menu/menu.component";

import styles from './authenticated.module.scss';
const cxBind = cx.bind(styles);

export const AuthenticatedView = () => {
	return <div className={cxBind('o-authenticated-view')}>
		<div className={cxBind('o-authenticated-view__menu')}>
			<Menu />
		</div>
		<div className={cxBind('o-authenticated-view__content')}>
			<Outlet />
		</div>
	</div>
}
