import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';

import { Loading, Table, Pagination, Card, Alert, AlertTypes, TextField, Button, ButtonTypes, HTMLButtonTypes } from '~components';

import { SITE_PATHS } from '../../sites.routes';
import { useSiteStore } from '../../stores/site';

import { MODULE_LIST_COLUMNS } from './site-detail-modules.const';

import {
	getPageParams,
	getPaginationProps,
	IModuleCreateDTO,
	IModuleUpdateDTO,
	useHeaderStore,
	useModuleStore,
	useRootContentTypeStore,
} from '~shared';

export const SiteDetailModulesPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const moduleFormMethods = useForm<IModuleCreateDTO>();
	const [modules, modulesLoading, modulesPagination, fetchModules] = useModuleStore((state) => [
		state.modules,
		state.modulesLoading,
		state.modulesPagination,
		state.fetchModules,
	]);
	const [createModuleLoading, createModule] = useModuleStore((state) => [
		state.createModuleLoading,
		state.createModule,
	]);
	const [updateModuleLoading, updateModule] = useModuleStore((state) => [
		state.updateModuleLoading,
		state.updateModule,
	]);
	const [removeModuleLoading, removeModule] = useModuleStore((state) => [
		state.removeModuleLoading,
		state.removeModule,
	]);
	const [disableContentTypeLoading, disableContentType] = useRootContentTypeStore((state) => [
		state.disableContentTypeLoading,
		state.disableContentType,
	]);
	const [site] = useSiteStore((state) => [state.site]);
	const { rootSiteId } = useParams();
	const { t } = useTranslation();
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);

	useEffect(() => {
		setBreadcrumbs([{ label: t(`BREADCRUMBS.SITES`), to: SITE_PATHS.ROOT }, { label: site?.name }, { label: t(`BREADCRUMBS.MODULES`) }]);
	}, []);

	useEffect(() => {
		console.log('sp', searchParams)
		// fetchModules(rootSiteId!, { ...getPageParams(searchParams), all: true });
	}, [searchParams]);

	const handleUpdate = async (moduleId: string, values: IModuleUpdateDTO): Promise<void> => {
		await updateModule(rootSiteId!, moduleId, values);
		fetchModules(rootSiteId!, { ...getPageParams(searchParams), all: true });
	}

	const handleRemove = async (moduleId: string): Promise<void> => {
		await removeModule(rootSiteId!, moduleId);
		fetchModules(rootSiteId!, { ...getPageParams(searchParams), all: true });
	}

	const handleCreateModule = async (values: IModuleCreateDTO): Promise<void> => {
		await createModule(rootSiteId!, {
			...values,
			active: true,
		});
		moduleFormMethods.reset();

		fetchModules(rootSiteId!, { ...getPageParams(searchParams), all: true });
	}

	return (
		<>
		<Loading loading={modulesLoading}>
			<Table
				columns={MODULE_LIST_COLUMNS(
					t,
					handleUpdate,
					updateModuleLoading,
					handleRemove,
					removeModuleLoading,
				)}
				rows={modules}
			></Table>
			<Pagination
				className="u-margin-top"
				totalPages={modulesPagination?.totalPages}
				number={modulesPagination?.number}
				size={modulesPagination?.size}
				{...getPaginationProps(searchParams, setSearchParams)}
			/>
		</Loading>
		<Card title="Add module" className='u-margin-top'>
			<FormProvider {...moduleFormMethods}>
				<form onSubmit={moduleFormMethods.handleSubmit(handleCreateModule)}>
					<Alert
						className="u-margin-bottom"
						type={AlertTypes.DANGER}
					>
						{moduleFormMethods.formState.errors?.root?.message}
					</Alert>
					<div className="u-row">
						<div className="u-col-md-5">
							<TextField name="name" label="Name"></TextField>
						</div>
						<div className="u-col-md-5">
							<TextField name="entryUrl" label="Entry URL"></TextField>
						</div>
						<div className="u-col-md-2 u-col--align-end">
							<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT} block>
								{createModuleLoading && (
									<i className="las la-redo-alt la-spin"></i>
								)}{' '}
								Add module
							</Button>
						</div>
					</div>
				</form>
			</FormProvider>
		</Card>
		</>
	);
};
