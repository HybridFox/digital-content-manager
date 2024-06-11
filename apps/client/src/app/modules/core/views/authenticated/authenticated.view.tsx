import { Outlet, useParams } from "react-router-dom"
import cx from 'classnames/bind';
import classNames from "classnames";

import { Menu } from "../../components/menu/menu.component";
import { RootMenu } from "../../components/menu/root-menu.component";
import { TopBar } from "../../components/top-bar/top-bar.component";


import styles from './authenticated.module.scss';

import { useConfigStore, useThemeStore } from "~shared";
const cxBind = cx.bind(styles);

export const AuthenticatedView = () => {
	const { siteId } = useParams();
	const [theme] = useThemeStore((state) => [state.theme]);
	const [config] = useConfigStore((state) => ([state.config]));

	return <div className={classNames(cxBind('o-authenticated-view'), `u-theme u-theme--${theme}`)} style={{
		...(config?.rootPrimaryColour && { '--color-primary': config.rootPrimaryColour }),
		...(config?.rootSecondaryColour && { '--color-secondary': config.rootSecondaryColour })
	} as React.CSSProperties}>
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
