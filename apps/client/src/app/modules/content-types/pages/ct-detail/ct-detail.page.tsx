import { useEffect } from 'react';
import { IAPIError, useContentComponentStore, useContentTypeFieldStore, useContentTypeStore } from '@ibs/shared';
import { Alert, AlertTypes, Button, Card, HTMLButtonTypes, Header, Loading, SelectInput, Table, TextInput } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';

import { CONTENT_TYPE_DETAIL_COLUMNS, addContentComponentSchema } from './ct-detail.const';

interface IAddContentComponentForm {
	contentComponentId: string;
	name: string;
}

export const CTDetailPage = () => {
	const [contentComponents, fetchContentComponents] = useContentComponentStore((state) => [state.contentComponents, state.fetchContentComponents]);
	const [contentType, contentTypeLoading, fetchContentType] = useContentTypeStore((state) => [state.contentType, state.contentTypeLoading, state.fetchContentType]);
	const [createFieldLoading, createField] = useContentTypeFieldStore((state) => [state.createFieldLoading, state.createField]);
	const params = useParams();
	const navigate = useNavigate();
	const formMethods = useForm<IAddContentComponentForm>({ resolver: yupResolver(addContentComponentSchema) });

	const { handleSubmit, setError, formState: { errors } } = formMethods;

	useEffect(() => {
		if (!params.contentTypeId) {
			return navigate('/not-found');
		}

		fetchContentComponents({ pagesize: -1 });
		fetchContentType(params.contentTypeId)
	}, []);

	const onCreateField = (values: IAddContentComponentForm) => {
		if (!contentType) {
			return;
		}

		createField(contentType.id, values)
			.then((field) => navigate(`fields/${field.id}`))
			.catch((error: IAPIError) => {
				setError('root', {
					message: error.code
				})
			});
	}

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
						<form onSubmit={handleSubmit(onCreateField)}>
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
								<div className="u-col-md-2 u-col--align-end">
									<Button htmlType={HTMLButtonTypes.SUBMIT} block>{createFieldLoading && (<i className="las la-redo-alt la-spin"></i>)} Add field</Button>
								</div>
							</div>
						</form>
					</FormProvider>
				</Card>
			</Loading>
		</>
	);
};
