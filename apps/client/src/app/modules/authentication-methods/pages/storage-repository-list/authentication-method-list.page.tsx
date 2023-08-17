import { useEffect } from 'react';
import { useAuthenticationMethodStore, useHeaderStore } from '@ibs/shared';
import { ButtonLink, ButtonTypes, Header, Loading, Table } from '@ibs/components';
import { useTranslation } from 'react-i18next';

import { AUTHENTICATION_METHODS_LIST_COLUMNS } from './authentication-method-list.const';

export const AuthenticationMethodListPage = () => {
	const [authenticationMethods, authenticationMethodsLoading, fetchAuthenticationMethods] = useAuthenticationMethodStore((state) => [
		state.authenticationMethods,
		state.authenticationMethodsLoading,
		state.fetchAuthenticationMethods,
	]);
	const { t } = useTranslation();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);

	useEffect(() => {
		fetchAuthenticationMethods({ all: true });
		setBreadcrumbs([{ label: t(`BREADCRUMBS.AUTHENTICATION_METHODS`) }]);
	}, []);

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t(`AUTHENTICATION_METHODS.TITLES.LIST`)}
				action={
					<ButtonLink to="create" type={ButtonTypes.PRIMARY}>
						<span className="las la-plus"></span> {t(`AUTHENTICATION_METHODS.ACTIONS.CREATE`)}
					</ButtonLink>
				}
			></Header>
			<Loading loading={authenticationMethodsLoading} text={t(`GENERAL.LABELS.LOADING`)}>
				<Table columns={AUTHENTICATION_METHODS_LIST_COLUMNS(t)} rows={authenticationMethods || []}></Table>
			</Loading>
		</>
	);
};
