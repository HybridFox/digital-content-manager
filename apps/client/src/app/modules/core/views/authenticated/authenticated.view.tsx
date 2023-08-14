import { Outlet, useNavigate, useParams } from "react-router-dom"
import cx from 'classnames/bind';
import { useEffect } from "react";
import { IAPIError, useAuthStore } from "@ibs/shared";

import { Menu } from "../../components/menu/menu.component";
import { RootMenu } from "../../components/menu/root-menu.component";

import styles from './authenticated.module.scss';
const cxBind = cx.bind(styles);

export const AuthenticatedView = () => {
	const authStore = useAuthStore();
	const navigate = useNavigate();
	const { siteId } = useParams();

	useEffect(() => {
		authStore.fetchUser()
			.catch((error: IAPIError) => {
				if (error.status === 401) {
					navigate('/auth/login');
				}

				if (error.code === 'NOT_INSTALLED') {
					navigate('/setup');
				}
			});
	}, []);

	return <div className={cxBind('o-authenticated-view')}>
		<div className={cxBind('o-authenticated-view__menu')}>
			{siteId && <Menu />}
			{!siteId && <RootMenu />}
		</div>
		<div className={cxBind('o-authenticated-view__content')}>
			<Outlet />
		</div>
	</div>
}
