import { Outlet } from "react-router-dom"
import cx from 'classnames/bind';

import { Menu } from "../menu/menu.component"

import styles from './root.module.scss';
const cxBind = cx.bind(styles);

export const Root = () => {
	return <div className={cxBind('u-root')}>
		<Outlet />
	</div>
}
