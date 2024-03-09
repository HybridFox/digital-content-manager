import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import {
	Alert,
	AlertTypes,
	Button,
	ButtonTypes,
	Card,
	HTMLButtonTypes,
	Table,
} from '~components';


import { CONTENT_TYPES_PATHS } from '../../content-types.routes';

import {
	CONTENT_TYPE_DETAIL_COLUMNS,
	addContentComponentSchema,
	addCompartmentSchema,
} from './ct-content-components.const';

import { SelectField, TextField } from '~forms';
import {
	CONTENT_TYPE_KINDS_TRANSLATIONS,
	IAPIError,
	IField,
	useCompartmentStore,
	useContentComponentStore,
	useContentTypeFieldStore,
	useContentTypeStore,
	useHeaderStore,
} from '~shared';

interface IAddContentComponentForm {
	contentComponentId: string;
	name: string;
	compartmentId?: string;
}

interface IAddCompartmentForm {
	name: string;
}

export const CTContentComponentsPage = () => {
	const [fieldRows, setFieldRows] = useState<IField[]>([]);
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
	const [createCompartmentLoading, createCompartment] =
		useCompartmentStore((state) => [
			state.createCompartmentLoading,
			state.createCompartment,
		]);
	const [compartments] =
		useCompartmentStore((state) => [
			state.compartments
		]);
	const [updateFieldOrderLoading, updateFieldOrder] =
		useContentTypeFieldStore((state) => [
			state.updateFieldOrderLoading,
			state.updateFieldOrder,
		]);
	const params = useParams();
	const navigate = useNavigate();
	const fieldFormMethods = useForm<IAddContentComponentForm>({
		resolver: yupResolver(addContentComponentSchema),
	});
	const compartmentFormMethods = useForm<IAddCompartmentForm>({
		resolver: yupResolver(addCompartmentSchema),
	});

	useEffect(() => {
		setBreadcrumbs([
			{ label: 'Content Types', to: generatePath(CONTENT_TYPES_PATHS.ROOT, { siteId }) },
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
		setFieldRows(contentType?.fields || [])
	}, [contentType?.fields])

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
				fieldFormMethods.setError('root', {
					message: error.code,
				});
			});
	};

	const onCreateCompartment = (values: IAddCompartmentForm) => {
		if (!contentType) {
			return;
		}

		createCompartment(siteId!, contentType.id, values)
			.then((field) => {
				compartmentFormMethods.reset();
			})
			.catch((error: IAPIError) => {
				compartmentFormMethods.setError('root', {
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
		setFieldRows(orderedRows)
		updateFieldOrder(siteId!, contentType!.id, orderedRows)
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
					rows={fieldRows}
					groups={compartments}
					rowGroupIdentifier='compartmentId'
				></Table>
			</div>
			<Card title="Add content component">
				<FormProvider {...fieldFormMethods}>
					<form onSubmit={fieldFormMethods.handleSubmit(onCreateField)}>
						<Alert
							className="u-margin-bottom"
							type={AlertTypes.DANGER}
						>
							{fieldFormMethods.formState.errors?.root?.message}
						</Alert>
						<div className="u-row">
							<div className={`u-col-md-${compartments.length ? '3' : '5'}`}>
								<SelectField
									name="contentComponentId"
									label="Content Component"
									fieldConfiguration={{ options: contentComponents.map((cc) => ({
										label: cc.name,
										value: cc.id,
									})) }}
								></SelectField>
							</div>
							<div className={`u-col-md-${compartments.length ? '4' : '5'}`}>
								<TextField name="name" label="Name"></TextField>
							</div>
							{!!compartments.length && (
								<div className="u-col-md-3">
									<SelectField
										name="compartmentId"
										label="Compartment"
										fieldConfiguration={{ options: compartments.map((cc) => ({
											label: cc.name,
											value: cc.id,
										})) }}
									></SelectField>
								</div>
							)}
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
			<Card title="Add compartment" className='u-margin-top'>
				<FormProvider {...compartmentFormMethods}>
					<form onSubmit={compartmentFormMethods.handleSubmit(onCreateCompartment)}>
						<Alert
							className="u-margin-bottom"
							type={AlertTypes.DANGER}
						>
							{compartmentFormMethods.formState.errors?.root?.message}
						</Alert>
						<div className="u-row">
							<div className="u-col-md-10">
								<TextField name="name" label="Name"></TextField>
							</div>
							<div className="u-col-md-2 u-col--align-end">
								<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT} block>
									{createCompartmentLoading && (
										<i className="las la-redo-alt la-spin"></i>
									)}{' '}
									Add compartment
								</Button>
							</div>
						</div>
					</form>
				</FormProvider>
			</Card>
		</>
	);
};
