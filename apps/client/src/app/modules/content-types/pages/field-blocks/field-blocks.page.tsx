import { useEffect } from 'react';
import { generatePath, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Alert, AlertTypes, Button, ButtonTypes, Card, HTMLButtonTypes, Loading, Table } from '~components';

import { CONTENT_TYPES_PATHS } from '../../content-types.routes';

import { addContentComponentSchema, FIELD_BLOCKS_COLUMNS } from './field-blocks.const';

import { NumberField, TextField, TextareaField, ToggleField, SelectField } from '~forms';
import { CONTENT_TYPE_KINDS_TRANSLATIONS, useContentComponentStore, useContentTypeFieldStore, useContentTypeStore, useFieldBlockStore, useHeaderStore } from '~shared';

interface IAddContentComponentForm {
	contentComponentId: string;
	name: string;
	compartmentId?: string;
}

export const FieldBlocksPage = () => {
	const { siteId, fieldId, contentTypeId } = useParams();
	const [contentType] =
		useContentTypeStore((state) => [
			state.contentType,
		]);
	const [contentTypeField] =
		useContentTypeFieldStore((state) => [
			state.field,
		]);
		const fieldFormMethods = useForm<IAddContentComponentForm>({
			resolver: yupResolver(addContentComponentSchema),
		});
	const [contentComponents, fetchContentComponents] =
		useContentComponentStore((state) => [
			state.contentComponents,
			state.fetchContentComponents,
		]);
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);
	const [fields, fieldsLoading, fetchFields] =
		useFieldBlockStore((state) => [
			state.fields,
			state.fieldsLoading,
			state.fetchFields,
		]);
	const [createFieldLoading, createField] =
		useFieldBlockStore((state) => [
			state.createFieldLoading,
			state.createField
		]);
	const [deleteFieldLoading, deleteField] =
		useFieldBlockStore((state) => [
			state.deleteFieldLoading,
			state.deleteField
		]);

	useEffect(() => {
		setBreadcrumbs([
			{ label: 'Content Types', to: generatePath(CONTENT_TYPES_PATHS.ROOT, { siteId }) },
			{
				label: contentType?.name,
				badge: contentType && CONTENT_TYPE_KINDS_TRANSLATIONS[contentType.kind],
				to: generatePath(CONTENT_TYPES_PATHS.DETAIL, {
					contentTypeId: contentType?.id || '',
					siteId
				}),
			},
			{
				label: 'Content Components',
				to: generatePath(CONTENT_TYPES_PATHS.DETAIL_CC, {
					contentTypeId: contentType?.id || '',
					siteId
				}),
			},
			{
				label: contentTypeField?.name,
				to: generatePath(CONTENT_TYPES_PATHS.FIELD_DETAIL, {
					contentTypeId: contentType?.id || '',
					fieldId: contentTypeField?.id || '',
					siteId
				}),
			},
			{
				label: 'Blocks',
			}
		]);
	}, [contentType, contentTypeField]);
	
	useEffect(() => {
		// TODO: pagination
		fetchFields(siteId!, contentTypeId!, fieldId!, {});
		fetchContentComponents(siteId!, { pagesize: -1, includeInternal: true });
	}, []);

	const onCreateField = (values: IAddContentComponentForm) => {
		createField(siteId!, contentTypeId!, fieldId!, values)
	};

	const onDeleteField = (blockId: string) => {
		deleteField(siteId!, contentTypeId!, fieldId!, blockId);
	};

	return (
		<>
			<div className="u-margin-top u-margin-bottom">
				<Loading loading={fieldsLoading}>
					<Table
						columns={FIELD_BLOCKS_COLUMNS(onDeleteField)}
						rows={fields || []}
					></Table>
				</Loading>
			</div>
			<Card title="Add block">
				<FormProvider {...fieldFormMethods}>
					<form onSubmit={fieldFormMethods.handleSubmit(onCreateField)}>
						<Alert
							className="u-margin-bottom"
							type={AlertTypes.DANGER}
						>
							{fieldFormMethods.formState.errors?.root?.message}
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
									Add block
								</Button>
							</div>
						</div>
					</form>
				</FormProvider>
			</Card>
		</>
	);
};
