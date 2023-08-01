import { Outlet } from "react-router-dom"
import cx from 'classnames/bind';

import styles from './anonymous.module.scss';
const cxBind = cx.bind(styles);

export const AnonymousView = () => {
	return <div className={cxBind('u-anonymous')}>
		<div className={cxBind('u-anonymous__content')}>
			<Outlet />
		</div>
	</div>
}
