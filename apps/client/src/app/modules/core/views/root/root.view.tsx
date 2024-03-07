import { Outlet, useNavigate } from "react-router-dom"
import { useEffect } from "react";

import { IAPIError, useAuthStore } from "~shared";

export const RootView = () => {
	const [fetchUser] = useAuthStore((state) => [state.fetchUser]);
	const navigate = useNavigate();

	useEffect(() => {
		fetchUser()
			.catch((error: IAPIError) => {
				if (error.status === 401) {
					navigate('/auth/login');
				}

				if (error.code === 'NOT_INSTALLED') {
					navigate('/setup');
				}
			});
	}, []);

	return <Outlet />
}
