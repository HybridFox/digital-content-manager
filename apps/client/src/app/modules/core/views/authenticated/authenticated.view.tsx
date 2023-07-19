import { Outlet, useNavigate } from "react-router-dom"
import cx from 'classnames/bind';
import { useEffect } from "react";
import { useAuthStore } from "@ibs/shared";

import { Menu } from "../../components/menu/menu.component";

import styles from './authenticated.module.scss';
const cxBind = cx.bind(styles);

export const AuthenticatedView = () => {
	const authStore = useAuthStore();
	const navigate = useNavigate()

	useEffect(() => {
		authStore.fetchUser()
			.catch((error) => {
				if (error.status === 401) {
					navigate('/auth/login');
				}
			});
	}, []);

	return <div className={cxBind('o-authenticated-view')}>
		<div className={cxBind('o-authenticated-view__menu')}>
			<Menu />
		</div>
		<div className={cxBind('o-authenticated-view__content')}>
			<Outlet />
		</div>
	</div>
}
