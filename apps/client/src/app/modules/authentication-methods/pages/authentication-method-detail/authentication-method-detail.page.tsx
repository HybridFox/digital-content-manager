import { AUTHENTICATION_METHOD_KINDS, useAuthenticationMethodStore, useHeaderStore } from '@ibs/shared';
import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { Header, Loading } from '@ibs/components';
import { Trans, useTranslation } from 'react-i18next';

import { AUTHENTICATION_METHOD_PATHS } from '../../authentication-methods.routes';

import { AUTHENTICATION_METHOD_DETAIL_TABS } from './authentication-method-detail.const';

export const AuthenticationMethodDetailPage = () => {
	const { t } = useTranslation();

	const [authenticationMethod, authenticationMethodLoading, fetchAuthenticationMethod] = useAuthenticationMethodStore((state) => [
		state.authenticationMethod,
		state.authenticationMethodLoading,
		state.fetchAuthenticationMethod,
	]);
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const { authenticationMethodId } = useParams();

	useEffect(() => {
		setBreadcrumbs([{ label: t(`BREADCRUMBS.AUTHENTICATION_METHODS`), to: AUTHENTICATION_METHOD_PATHS.ROOT }, { label: t(`BREADCRUMBS.EDIT`) }]);
	}, [authenticationMethod]);

	useEffect(() => {
		if (!authenticationMethodId) {
			return;
		}

		fetchAuthenticationMethod(authenticationMethodId);
	}, [authenticationMethodId]);

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={<Trans t={t} i18nKey="AUTHENTICATION_METHODS.TITLES.EDIT" values={{ authenticationMethodName: authenticationMethod?.name || '...' }} />}
				tabs={AUTHENTICATION_METHOD_DETAIL_TABS(t, authenticationMethodId!, authenticationMethod?.kind as AUTHENTICATION_METHOD_KINDS)}
			></Header>
			<div className="u-margin-top">
				<Loading loading={authenticationMethodLoading} text="Loading data...">
					<Outlet />
				</Loading>
			</div>
		</>
	);
};
