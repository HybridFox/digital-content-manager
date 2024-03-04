import { useEffect, useState } from 'react';
import {
	CONTENT_TYPE_KINDS_TRANSLATIONS,
	IAPIError,
	IField,
	useContentComponentStore,
	useContentTypeFieldStore,
	useContentTypeStore,
	useHeaderStore,
} from '@ibs/shared';
import {
	Alert,
	AlertTypes,
	Button,
	ButtonTypes,
	Card,
	HTMLButtonTypes,
	Table,
} from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { SelectField, TextField } from '@ibs/forms';

import { CONTENT_TYPES_PATHS } from '../../content-types.routes';

import {
	CONTENT_TYPE_DETAIL_COLUMNS,
	addContentComponentSchema,
} from './ct-content-components.const';

interface IAddContentComponentForm {
	contentComponentId: string;
	name: string;
}

export const CTContentComponentsPage = () => {
	const [contentComponents, fetchContentComponents] =
		useContentComponentStore((state) => [
			state.contentComponents,
			state.fetchContentComponents,
		]);
	const [deleteError, setDeleteError] = useState<string | null>(null);
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);
	const [contentType, fetchContentType] = useContentTypeStore((state) => [
		state.contentType,
		state.fetchContentType,
	]);
	const { siteId } = useParams();
	const [createFieldLoading, createField, deleteField] =
		useContentTypeFieldStore((state) => [
			state.createFieldLoading,
			state.createField,
			state.deleteField,
		]);
	const [updateFieldOrderLoading, updateFieldOrder] =
		useContentTypeFieldStore((state) => [
			state.updateFieldOrderLoading,
			state.updateFieldOrder,
		]);
	const params = useParams();
	const navigate = useNavigate();
	const formMethods = useForm<IAddContentComponentForm>({
		resolver: yupResolver(addContentComponentSchema),
	});

	const {
		handleSubmit,
		setError,
		formState: { errors },
	} = formMethods;

	useEffect(() => {
		setBreadcrumbs([
			{ label: 'Content Types', to: CONTENT_TYPES_PATHS.ROOT },
			{
				label: contentType?.name,
				badge: contentType && CONTENT_TYPE_KINDS_TRANSLATIONS[contentType.kind],
				to: generatePath(CONTENT_TYPES_PATHS.DETAIL, {
					contentTypeId: contentType?.id || '',
					siteId,
				}),
			},
			{ label: 'Content Components' },
		]);
	}, [contentType]);

	useEffect(() => {
		if (!params.contentTypeId) {
			return navigate('/not-found');
		}

		fetchContentComponents(siteId!, { pagesize: -1, includeInternal: true });
	}, []);

	const onCreateField = (values: IAddContentComponentForm) => {
		if (!contentType) {
			return;
		}

		createField(siteId!, contentType.id, values)
			.then((field) =>
				navigate(
					generatePath(CONTENT_TYPES_PATHS.FIELD_DETAIL, {
						contentTypeId: contentType.id,
						fieldId: field.id,
						siteId,
					})
				)
			)
			.catch((error: IAPIError) => {
				setError('root', {
					message: error.code,
				});
			});
	};

	const onDeleteField = (fieldId: string) => {
		if (!contentType) {
			return;
		}

		deleteField(siteId!, contentType.id, fieldId)
			.then(() => {
				setDeleteError(null);
				// TODO: fix this so that i dont have to reload the whole CT
				fetchContentType(siteId!, contentType.id)

			})
			.catch((error: IAPIError) => setDeleteError(error.code));
	};

	const onOrderChange = (orderedRows: IField[]) => {
		updateFieldOrder(siteId!, contentType!.id, orderedRows.map((row) => row.id!))
	}

	return (
		<>
			<div className="u-margin-top u-margin-bottom">
				<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>
					{deleteError}
				</Alert>
				<Table
					orderable={true}
					onOrderChange={onOrderChange}
					columns={CONTENT_TYPE_DETAIL_COLUMNS(onDeleteField)}
					rows={contentType?.fields || []}
				></Table>
			</div>
			<Card title="Add content component">
				<FormProvider {...formMethods}>
					<form onSubmit={handleSubmit(onCreateField)}>
						<Alert
							className="u-margin-bottom"
							type={AlertTypes.DANGER}
						>
							{errors?.root?.message}
						</Alert>
						<div className="u-row">
							<div className="u-col-md-5">
								<SelectField
									name="contentComponentId"
									label="Content Component"
									fieldConfiguration={{ options: contentComponents.map((cc) => ({
										label: cc.name,
										value: cc.id,
									})) }}
								></SelectField>
							</div>
							<div className="u-col-md-5">
								<TextField name="name" label="Name"></TextField>
							</div>
							<div className="u-col-md-2 u-col--align-end">
								<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT} block>
									{createFieldLoading && (
										<i className="las la-redo-alt la-spin"></i>
									)}{' '}
									Add field
								</Button>
							</div>
						</div>
					</form>
				</FormProvider>
			</Card>
		</>
	);
};
