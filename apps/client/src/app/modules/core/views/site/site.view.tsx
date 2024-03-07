import { Outlet, useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react";

import { IAPIError, useAuthStore } from "~shared";

export const SiteView = () => {
	const [fetchUser, fetchSite] = useAuthStore((state) => [state.fetchUser, state.fetchSite]);
	const { siteId } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		fetchSite(siteId!);
		fetchUser(siteId)
			.catch((error: IAPIError) => {
				if (error.status === 401) {
					navigate('/auth/login');
				}

				if (error.code === 'NOT_INSTALLED') {
					navigate('/setup');
				}
			});
	}, [siteId]);

	return <Outlet />
}
