import { Outlet } from "react-router-dom"
import cx from 'classnames/bind';
import { useEffect } from "react";

import styles from './root.module.scss';

import { useStatusStore } from "~shared";
const cxBind = cx.bind(styles);

export const Root = () => {
	const [fetchStatus] = useStatusStore((state) => [state.fetchStatus]);

	useEffect(() => {
		fetchStatus();
	}, []);
	
	return <div className={cxBind('u-root')}>
		<Outlet />
	</div>
}
