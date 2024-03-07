import { useEffect } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes, Header, RenderFields } from '~components';

import { STORAGE_PATHS } from '../../storage.routes';
import { STORAGE_KIND_FIELDS, STORAGE_KIND_OPTIONS } from '../../storage.const';

import { createStorageRepositorySchema } from './storage-repository-create.const';

import { SelectField, TextField } from '~forms';
import {
	IAPIError,
	STORAGE_KINDS,
	useHeaderStore,
	useStorageRepositoryStore,
} from '~shared';

interface CreateStorageRepositoryForm {
	name: string;
	kind: STORAGE_KINDS;
	configuration: any;
}

export const StorageRepositoryCreatePage = () => {
	const [createStorageRepository, createStorageRepositoryLoading] = useStorageRepositoryStore((state) => [
		state.createStorageRepository,
		state.createStorageRepositoryLoading,
	]);
	const navigate = useNavigate();
	const { siteId } = useParams();
	const { t } = useTranslation();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const formMethods = useForm<CreateStorageRepositoryForm>({
		resolver: yupResolver(createStorageRepositorySchema)
	});

	const {
		handleSubmit,
		formState: { errors },
		setError,
		watch,
	} = formMethods;
	const kind = watch("kind");

	useEffect(() => {
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.STORAGE_REPOSITORIES`), to: STORAGE_PATHS.ROOT },
			{ label: t(`BREADCRUMBS.CREATE`) },
		]);
	}, []);

	const onSubmit = (values: CreateStorageRepositoryForm) => {
		createStorageRepository(siteId!, values)
			.then((storageRepository) => navigate(generatePath(STORAGE_PATHS.DETAIL, { siteId, storageRepositoryId: storageRepository.id })))
			.catch((error: IAPIError) => {
				setError('root', {
					message: error.code,
				});
			});
	};

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={
					<>
						Create Storage Repository
					</>
				}
			></Header>
			<div className="u-margin-top">
				<FormProvider {...formMethods}>
					<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>
						{errors?.root?.message}
					</Alert>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="u-margin-bottom">
							<TextField name="name" label="Name" />
						</div>
						<div className="u-margin-bottom">
							<SelectField name="kind" label="Kind" fieldConfiguration={{ options: STORAGE_KIND_OPTIONS }} />
						</div>
						{kind && <RenderFields siteId='' fields={STORAGE_KIND_FIELDS[kind] || []} fieldPrefix='configuration.'></RenderFields>}
						<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
							{createStorageRepositoryLoading && <i className="las la-redo-alt la-spin"></i>} Save
						</Button>
					</form>
				</FormProvider>
			</div>
		</>
	);
};
