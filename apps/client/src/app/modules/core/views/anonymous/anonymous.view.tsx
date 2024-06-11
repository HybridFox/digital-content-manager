import { Outlet } from "react-router-dom"
import cx from 'classnames/bind';
import classNames from "classnames";

import styles from './anonymous.module.scss';

import { useConfigStore, useThemeStore } from "~shared";
const cxBind = cx.bind(styles);

export const AnonymousView = () => {
	const [theme] = useThemeStore((state) => [state.theme]);
	const [config] = useConfigStore((state) => ([state.config]));

	return <div className={classNames(cxBind('u-anonymous'), `u-theme u-theme--${theme}`)} style={{
		...(config?.rootPrimaryColour && { '--color-primary': config.rootPrimaryColour }),
		...(config?.rootSecondaryColour && { '--color-secondary': config.rootSecondaryColour })
	} as any}>
		<div className={cxBind('u-anonymous__content')}>
			<Outlet />
		</div>
	</div>
}
