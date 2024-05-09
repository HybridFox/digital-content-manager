import { useParams, useSearchParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

import { Alert, AlertTypes, Button, ButtonTypes, Card, HTMLButtonTypes, Loading, Pagination, Table, Tabs } from '~components';
import { SelectField } from '~components';

import { useSiteStore } from '../../../sites/stores/site';

import { AUTHENTICATION_METHOD_ROLE_ASSIGNMENTS_COLUMNS, addRoleAssignmentSchema } from './authentication-method-role-assignment.const';

import { IAPIError, getPageParams, getPaginationProps, useAuthenticationMethodRoleAssignmentStore, useAuthenticationMethodStore, useRoleStore, useSiteRoleStore } from '~shared';

interface AddAssignmentForm {
	siteId: string | undefined;
	roleId: string;
}

export const AuthenticationMethodRoleAssignmentPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const { t } = useTranslation();
	const [assignmentType, setAssignmentType] = useState<'root' | 'site'>('site');
	const [authenticationMethod] = useAuthenticationMethodStore((state) => [
		state.authenticationMethod,
	]);
	const [authenticationMethodRoleAssignments, authenticationMethodRoleAssignmentsPagination, authenticationMethodRoleAssignmentLoading, fetchAuthenticationMethodRoleAssignments] = useAuthenticationMethodRoleAssignmentStore((state) => [
		state.authenticationMethodRoleAssignments,
		state.authenticationMethodRoleAssignmentsPagination,
		state.authenticationMethodRoleAssignmentLoading,
		state.fetchAuthenticationMethodRoleAssignments,
	]);
	const [createAuthenticationMethodRoleAssignmentLoading, createAuthenticationMethodRoleAssignment] = useAuthenticationMethodRoleAssignmentStore((state) => [
		state.createAuthenticationMethodRoleAssignmentLoading,
		state.createAuthenticationMethodRoleAssignment,
	]);
	const [removeAuthenticationMethodRoleAssignment] = useAuthenticationMethodRoleAssignmentStore((state) => [
		state.removeAuthenticationMethodRoleAssignment,
	]);
	const [sites, sitesLoading, fetchSites] = useSiteStore((state) => [state.sites, state.sitesLoading, state.fetchSites])
	const [siteRoles, siteRolesLoading, fetchSiteRoles] = useSiteRoleStore((state) => [state.roles, state.rolesLoading, state.fetchRoles])
	const [roles, rolesLoading, fetchRoles] = useRoleStore((state) => [state.roles, state.rolesLoading, state.fetchRoles])
	const { authenticationMethodId } = useParams();
	const formMethods = useForm<AddAssignmentForm>({
		resolver: yupResolver(addRoleAssignmentSchema)
	});

	const {
		handleSubmit,
		formState: { errors },
		watch,
		reset,
		setError
	} = formMethods;
	
	const selectedSiteId = watch('siteId');

	useEffect(() => {
		if (!selectedSiteId) {
			fetchRoles({ pagesize: -1 });
			return;
		}

		fetchSiteRoles(selectedSiteId, { pagesize: -1 });
	}, [selectedSiteId])

	useEffect(() => {
		// TODO: Dynamic Search
		fetchSites({ pagesize: -1 });
	}, []);

	useEffect(() => {
		fetchAuthenticationMethodRoleAssignments(authenticationMethodId!, { ...getPageParams(searchParams) });
	}, [searchParams])
	
	const onAddAssignment = (values: AddAssignmentForm) => {
		if (!authenticationMethodId) {
			return;
		}
	
		createAuthenticationMethodRoleAssignment(authenticationMethodId, values)
			.then(() => fetchAuthenticationMethodRoleAssignments(authenticationMethodId!))
			.catch((error: IAPIError) => {
				setError('root', {
					message: error.code,
				});
			});
	};
	
	const onRemoveAssignment = (assignmentId: string) => {
		if (!authenticationMethodId) {
			return;
		}
	
		removeAuthenticationMethodRoleAssignment(authenticationMethodId, assignmentId)
			.then(() => fetchAuthenticationMethodRoleAssignments(authenticationMethodId!))
			.catch((error: IAPIError) => {
				setError('root', {
					message: error.code,
				});
			});
	};

	return (
		<>
			<Alert className='u-margin-bottom' closable={false} type={AlertTypes.INFO}>{t('AUTHENTICATION_METHODS.MESSAGES.PERSISTING_ROLES')}</Alert>
			<Loading loading={authenticationMethodRoleAssignmentLoading}>
				<Table columns={AUTHENTICATION_METHOD_ROLE_ASSIGNMENTS_COLUMNS(t, onRemoveAssignment)} rows={authenticationMethodRoleAssignments || []}/>
				<Pagination
					className="u-margin-top"
					totalPages={authenticationMethodRoleAssignmentsPagination?.totalPages}
					number={authenticationMethodRoleAssignmentsPagination?.number}
					size={authenticationMethodRoleAssignmentsPagination?.size}
					{...getPaginationProps(searchParams, setSearchParams)}
				/>
			</Loading>
			<Card title="Add role assignment" className='u-margin-top'>
				<FormProvider {...formMethods}>
					<Tabs selectedTabId={assignmentType} tabs={[{
						id: 'root',
						label: 'Root Role',
						onClick: () => {
							setAssignmentType('root');
							reset();
						}
					}, {
						id: 'site',
						label: 'Site Role',
						onClick: () => {
							setAssignmentType('site');
							reset();
						}
					}]}></Tabs>
					<form onSubmit={handleSubmit(onAddAssignment)}>
						<Alert
							className="u-margin-bottom"
							type={AlertTypes.DANGER}
						>
							{errors?.root?.message}
						</Alert>
						<div className="u-row">
							{assignmentType === 'site' && (
								<>
									<div className="u-col-md-5">
										<SelectField
											name="siteId"
											label="Site"
											fieldConfiguration={{ options: (sites || []).map((site) => ({
												label: site.name,
												value: site.id,
											})) }}
										></SelectField>
									</div>
									<div className="u-col-md-5">
										<SelectField
											name="roleId"
											label="Role"
											disabled={!selectedSiteId}
											fieldConfiguration={{ options: (siteRoles || []).map((roles) => ({
												label: roles.name,
												value: roles.id,
											})) }}
										></SelectField>
									</div>
								</>
							)}
							{assignmentType === 'root' && (
								<div className="u-col-md-10">
									<SelectField
										name="roleId"
										label="Role"
										fieldConfiguration={{ options: (roles || []).map((roles) => ({
											label: roles.name,
											value: roles.id,
										})) }}
									></SelectField>
								</div>
							)}
							<div className="u-col-md-2 u-col--align-end">
								<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT} block>
									{createAuthenticationMethodRoleAssignmentLoading ? (
										<i className="las la-redo-alt la-spin"></i>
									) : (
										<i className="las la-plus"></i>
									)}{' '}
									Add Role Assignment
								</Button>
							</div>
						</div>
					</form>
				</FormProvider>
			</Card>
		</>
	);
};
