import { useEffect } from 'react';
import { IAPIError, useContentComponentStore, useContentTypeFieldStore, useContentTypeStore } from '@ibs/shared';
import { Alert, AlertTypes, Button, Card, HTMLButtonTypes, Header, Loading, SelectInput, Table, TextInput } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';

import { CONTENT_TYPE_DETAIL_COLUMNS, addContentComponentSchema } from './field-detail.const';

interface IAddContentComponentForm {
	contentComponentId: string;
	name: string;
}

export const FieldDetailPage = () => {
	const [contentComponents, fetchContentComponents] = useContentComponentStore((state) => [state.contentComponents, state.fetchContentComponents]);
	const [contentType, contentTypeLoading, fetchContentType] = useContentTypeStore((state) => [state.contentType, state.contentTypeLoading, state.fetchContentType]);
	const [contentTypeField, contentTypeFieldLoading, fetchContentTypeField] = useContentTypeFieldStore((state) => [state.field, state.fieldLoading, state.fetchField]);
	const params = useParams();
	const navigate = useNavigate();
	const formMethods = useForm<IAddContentComponentForm>({ resolver: yupResolver(addContentComponentSchema) });

	const { handleSubmit, setError, formState: { errors } } = formMethods;

	useEffect(() => {
		if (!params.contentTypeId || !params.fieldId) {
			return navigate('/not-found');
		}

		fetchContentTypeField(params.contentTypeId, params.fieldId);
		fetchContentType(params.contentTypeId)
	}, []);

	return (
		<>
			<Header
				title="Edit content type"
				subTitle="Content types"
			></Header>
			<Loading text='Content type loading...' loading={contentTypeLoading}>
				<div className='u-margin-top u-margin-bottom'>
					<Table columns={CONTENT_TYPE_DETAIL_COLUMNS} rows={contentType?.fields || []}></Table>
				</div>
				<Card title="Add content component">
					<FormProvider {...formMethods}>
						<form>
							<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>{errors?.root?.message}</Alert>
							<div className="u-row">
								<div className="u-col-md-5">
									<SelectInput
										name="contentComponentId"
										label='Content Component'
										options={contentComponents.map(
											(cc) => ({ label: cc.name, value: cc.id })
										)}
									></SelectInput>
								</div>
								<div className="u-col-md-5">
									<TextInput
										name="name"
										label='Name'
									></TextInput>
								</div>
							</div>
						</form>
					</FormProvider>
				</Card>
			</Loading>
		</>
	);
};
