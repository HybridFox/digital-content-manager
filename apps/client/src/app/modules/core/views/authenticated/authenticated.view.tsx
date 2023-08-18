import { Outlet, useParams } from "react-router-dom"
import cx from 'classnames/bind';
import { useAuthStore } from "@ibs/shared";
import classNames from "classnames";

import { Menu } from "../../components/menu/menu.component";
import { RootMenu } from "../../components/menu/root-menu.component";
import { TopBar } from "../../components/top-bar/top-bar.component";

import styles from './authenticated.module.scss';
const cxBind = cx.bind(styles);

export const AuthenticatedView = () => {
	const { siteId } = useParams();
	const [theme] = useAuthStore((state) => [state.theme])

	return <div className={classNames(cxBind('o-authenticated-view'), `u-theme u-theme--${theme}`)}>
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
