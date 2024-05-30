import { Outlet } from "react-router-dom"
import cx from 'classnames/bind';
import { useEffect } from "react";
import { Helmet } from 'react-helmet-async';

import { Loading } from "~components";

import styles from './root.module.scss';

import { useConfigStore, useHeaderStore, useStatusStore } from "~shared";
const cxBind = cx.bind(styles);

export const Root = () => {
	const [fetchStatus] = useStatusStore((state) => [state.fetchStatus]);
	const [title] = useHeaderStore((state) => ([state.title]));
	const [config, fetchConfig, configLoading] = useConfigStore((state) => ([state.config, state.fetchConfig, state.configLoading]));

	useEffect(() => {
		fetchStatus();
		fetchConfig();
	}, []);

	useEffect(() => {
		const root = document.querySelector('.u-theme') as HTMLElement;
		console.log(config, root)
		config?.rootPrimaryColour && root?.style?.setProperty('--color-primary', config.rootPrimaryColour as string, 'important');
		config?.rootSecondaryColour && root?.style?.setProperty('--color-secondary', config.rootSecondaryColour as string, 'important');
	}, [config])
	
	return <div className={cxBind('u-root')}>
		<Loading loading={configLoading}>
			<Helmet>
				<title>{`${title ? `${title} :: ` : ''}${config?.rootName || 'Digital Content Manager'}`}</title>
			</Helmet>
			<Outlet />
		</Loading>
	</div>
}
