import { Outlet } from "react-router-dom"
import cx from 'classnames/bind';
import classNames from "classnames";

import styles from './anonymous.module.scss';

import { useThemeStore } from "~shared";
const cxBind = cx.bind(styles);

export const AnonymousView = () => {
	const [theme] = useThemeStore((state) => [state.theme]);
	return <div className={classNames(cxBind('u-anonymous'), `u-theme u-theme--${theme}`)}>
		<div className={cxBind('u-anonymous__content')}>
			<Outlet />
		</div>
	</div>
}
