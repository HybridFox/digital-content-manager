import { useEffect, useState } from 'react';
import {
	IAPIError,
	useContentComponentFieldStore,
	useContentComponentStore,
	useHeaderStore,
} from '@ibs/shared';
import {
	Alert,
	AlertTypes,
	Button,
	Card,
	HTMLButtonTypes,
	Table,
} from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { SelectField, TextField } from '@ibs/forms';

import { CONTENT_COMPONENTS_PATHS } from '../../content-components.routes';

import {
	CONTENT_TYPE_DETAIL_COLUMNS,
	addContentComponentSchema,
} from './cc-content-components.const';

interface IAddContentComponentForm {
	contentComponentId: string;
	name: string;
}

export const CCContentComponentsPage = () => {
	const [contentComponents, fetchContentComponents] =
		useContentComponentStore((state) => [
			state.contentComponents,
			state.fetchContentComponents,
		]);
	const [deleteError, setDeleteError] = useState<string | null>(null);
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);
	const [contentComponent, fetchContentComponent] = useContentComponentStore((state) => [
		state.contentComponent,
		state.fetchContentComponent,
	]);
	const [createFieldLoading, createField, deleteField] =
		useContentComponentFieldStore((state) => [
			state.createFieldLoading,
			state.createField,
			state.deleteField,
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
			{ label: 'Content Components', to: CONTENT_COMPONENTS_PATHS.ROOT },
			{
				label: contentComponent?.name,
				to: generatePath(CONTENT_COMPONENTS_PATHS.DETAIL, {
					contentComponentId: contentComponent?.id || '',
				}),
			},
			{ label: 'Content Components' },
		]);
	}, [contentComponent]);

	useEffect(() => {
		if (!params.contentComponentId) {
			return navigate('/not-found');
		}

		fetchContentComponents({ pagesize: -1, includeInternal: true });
	}, []);

	const onCreateField = (values: IAddContentComponentForm) => {
		if (!contentComponent) {
			return;
		}

		createField(contentComponent.id, values)
			.then((field) =>
				navigate(
					generatePath(CONTENT_COMPONENTS_PATHS.FIELD_DETAIL, {
						contentComponentId: contentComponent.id,
						fieldId: field.id,
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
		if (!contentComponent) {
			return;
		}

		deleteField(contentComponent.id, fieldId)
			.then(() => {
				setDeleteError(null);
				// TODO: fix this so that i dont have to reload the whole CT
				fetchContentComponent(contentComponent.id)

			})
			.catch((error: IAPIError) => setDeleteError(error.code));
	};

	return (
		<>
			<div className="u-margin-top u-margin-bottom">
				<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>
					{deleteError}
				</Alert>
				<Table
					columns={CONTENT_TYPE_DETAIL_COLUMNS(onDeleteField)}
					rows={contentComponent?.fields || []}
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
									fieldConfiguration={{ options: contentComponents.filter((cc) => cc.id !== params.contentComponentId).map((cc) => ({
										label: cc.name,
										value: cc.id,
									})) }}
								></SelectField>
							</div>
							<div className="u-col-md-5">
								<TextField name="name" label="Name"></TextField>
							</div>
							<div className="u-col-md-2 u-col--align-end">
								<Button htmlType={HTMLButtonTypes.SUBMIT} block>
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
