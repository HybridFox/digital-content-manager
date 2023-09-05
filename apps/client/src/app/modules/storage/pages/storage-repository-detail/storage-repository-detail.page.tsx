import { IAPIError, useHeaderStore, useStorageRepositoryStore } from '@ibs/shared';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes, Header, Loading, RenderFields } from '@ibs/components';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField } from '@ibs/forms';

import { STORAGE_KIND_FIELDS } from '../../storage.const';
import { STORAGE_PATHS } from '../../storage.routes';

import { editStorageRepositorySchema } from './storage-repository-detail.const';

interface EditStorageRepositoryForm {
	name: string;
	configuration: any;
}

export const StorageRepositoryDetailPage = () => {
	const { t } = useTranslation();

	const [storageRepository, storageRepositoryLoading, fetchStorageRepository] = useStorageRepositoryStore((state) => [
		state.storageRepository,
		state.storageRepositoryLoading,
		state.fetchStorageRepository,
	]);
	const [updateStorageRepositoryLoading, updateStorageRepository] = useStorageRepositoryStore((state) => [
		state.updateStorageRepositoryLoading,
		state.updateStorageRepository,
	]);
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const { storageRepositoryId, siteId } = useParams();
	const formMethods = useForm<EditStorageRepositoryForm>({
		resolver: yupResolver(editStorageRepositorySchema),
		values: storageRepository,
	});

	const {
		handleSubmit,
		formState: { errors },
		setError,
	} = formMethods;

	useEffect(() => {
		setBreadcrumbs([{ label: t(`BREADCRUMBS.STORAGE_REPOSITORIES`), to: STORAGE_PATHS.ROOT }, { label: t(`BREADCRUMBS.EDIT`) }]);
	}, [storageRepository]);

	useEffect(() => {
		if (!storageRepositoryId) {
			return;
		}

		fetchStorageRepository(siteId!, storageRepositoryId);
	}, [storageRepositoryId]);

	const onSubmit = (values: EditStorageRepositoryForm) => {
		if (!storageRepositoryId) {
			return;
		}

		updateStorageRepository(siteId!, storageRepositoryId, values).catch((error: IAPIError) => {
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
						Edit storage repository <i>"{storageRepository?.name || '...'}"</i>
					</>
				}
			></Header>
			<div className="u-margin-top">
				<Loading loading={storageRepositoryLoading} text="Loading data...">
					<FormProvider {...formMethods}>
						<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>
							{errors?.root?.message}
						</Alert>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="u-margin-bottom">
								<TextField name="name" label="Name" />
							</div>
							{storageRepository?.kind && (
								<RenderFields siteId='' fields={STORAGE_KIND_FIELDS[storageRepository?.kind] || []} fieldPrefix="configuration."></RenderFields>
							)}
							<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
								{updateStorageRepositoryLoading && <i className="las la-redo-alt la-spin"></i>} Save
							</Button>
						</form>
					</FormProvider>
				</Loading>
			</div>
		</>
	);
};
