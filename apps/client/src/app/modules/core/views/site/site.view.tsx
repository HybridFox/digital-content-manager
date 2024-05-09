import { Outlet, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react";

import { Loading } from "~components";

import { MfeUtil } from "../../helpers/federation";

import { IAPIError, useAuthStore, useModuleStore } from "~shared";

const mfeUtil = new MfeUtil();

export const SiteView = () => {
	const [fetchUser, fetchSite] = useAuthStore((state) => [state.fetchUser, state.fetchSite]);
	const { siteId } = useParams();
	const navigate = useNavigate();
	const [moduleLoadingStarted, setModuleLoadingStarted] = useState(false);
	const [routerReady, setRouterReady] = useState(false);
	const [modules, modulesLoading, fetchModules] = useModuleStore((state) => ([state.modules, state.modulesLoading, state.fetchModules]));
	const [externalModulesLoading, setExternalModulesLoading] = useState(false);

	useEffect(() => {
		if (!siteId || moduleLoadingStarted) {
			return;
		}

		setModuleLoadingStarted(true);
		fetchModules(siteId);
	}, [siteId]);

	useEffect(() => {
		if (!modules.length) {
			setExternalModulesLoading(false);
			setRouterReady(true);
			return;
		}
		
		setExternalModulesLoading(true);
		(async () => {
			await Promise.all(modules.map((mfeModule) => mfeUtil.loadRemoteFile({
				remoteEntry: mfeModule.entryUrl,
				remoteName: mfeModule.name,
				exposedFile: 'entry'
			})));
			console.log('done loading')
			setExternalModulesLoading(false);
			setRouterReady(true);
		})()
	}, [modules])

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

	return <Loading loading={externalModulesLoading || !routerReady} text="Loading external modules...">
		<Outlet />
	</Loading>
}
