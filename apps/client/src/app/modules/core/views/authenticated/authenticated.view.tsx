import { Outlet, useParams } from "react-router-dom"
import cx from 'classnames/bind';

import { Menu } from "../../components/menu/menu.component";
import { RootMenu } from "../../components/menu/root-menu.component";
import { TopBar } from "../../components/top-bar/top-bar.component";

import styles from './authenticated.module.scss';
const cxBind = cx.bind(styles);

export const AuthenticatedView = () => {
	const { siteId } = useParams();

	return <div className={cxBind('o-authenticated-view')}>
		<div className={cxBind('o-authenticated-view__menu')}>
			{siteId && <Menu />}
			{!siteId && <RootMenu />}
		</div>
		<div className={cxBind('o-authenticated-view__content')}>
			<TopBar />
			<Outlet />
		</div>
	</div>
}
