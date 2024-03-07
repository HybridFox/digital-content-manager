import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { ButtonLink, ButtonTypes, Header, Loading, Pagination, Table } from '~components';

import { AUTHENTICATION_METHODS_LIST_COLUMNS } from './authentication-method-list.const';

import { getPageParams, getPaginationProps, useAuthenticationMethodStore, useHeaderStore } from '~shared';

export const AuthenticationMethodListPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [authenticationMethods, authenticationMethodsPagination, authenticationMethodsLoading, fetchAuthenticationMethods] = useAuthenticationMethodStore((state) => [
		state.authenticationMethods,
		state.authenticationMethodsPagination,
		state.authenticationMethodsLoading,
		state.fetchAuthenticationMethods,
	]);
	const { t } = useTranslation();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);

	useEffect(() => {
		setBreadcrumbs([{ label: t(`BREADCRUMBS.AUTHENTICATION_METHODS`) }]);
	}, []);

	useEffect(() => {
		fetchAuthenticationMethods({ all: true, ...getPageParams(searchParams) });
	}, [searchParams])

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
				<Pagination
					className="u-margin-top"
					totalPages={authenticationMethodsPagination?.totalPages}
					number={authenticationMethodsPagination?.number}
					size={authenticationMethodsPagination?.size}
					{...getPaginationProps(searchParams, setSearchParams)}
				/>
			</Loading>
		</>
	);
};
