import { CONTENT_TYPE_KINDS_OPTIONS, IAPIError, useContentTypeStore, useHeaderStore } from '@ibs/shared';
import { Alert, AlertTypes, Button, HTMLButtonTypes, Header } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { generatePath, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { SelectField, TextField, TextareaField } from '@ibs/forms';

import { CONTENT_TYPES_PATHS } from '../../content-types.routes';

import { createContentTypeForm } from './ct-create.const';

interface ICreateContentTypeForm {
	name: string;
	description: string;
}

export const CTCreatePage = () => {
	const formMethods = useForm<ICreateContentTypeForm>({ resolver: yupResolver(createContentTypeForm) });
	const [createContentType] = useContentTypeStore((state) => [state.createContentType]);
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const navigate = useNavigate();
	const { handleSubmit, setError, formState: { errors } } = formMethods;

	useEffect(() => {
		setBreadcrumbs([
			{ label: 'Content Types', to: CONTENT_TYPES_PATHS.ROOT },
			{ label: 'Create' },
		]);
	}, []);

	const onSubmit = (values: ICreateContentTypeForm) => {
		createContentType(values)
			.then((contentType) => navigate(generatePath(CONTENT_TYPES_PATHS.DETAIL, { contentTypeId: contentType.id })))
			.catch((error: IAPIError) => {
				setError('root', {
					message: error.code
				})
			});
	}

	return (
		<>
			<Header
				title="Create content type"
				breadcrumbs={breadcrumbs}
			></Header>
			<FormProvider {...formMethods}>
				<form className='u-margin-top' onSubmit={handleSubmit(onSubmit)}>
					<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>{errors?.root?.message}</Alert>
					<TextField
						name="name"
						label='Name'
					></TextField>
					<div className="u-margin-top">
						<TextareaField
							name="description"
							label="Description"
						></TextareaField>
					</div>
					<div className="u-margin-top">
						<SelectField
							name="kind"
							label="Content Type Kind"
							fieldConfiguration={{ options: CONTENT_TYPE_KINDS_OPTIONS }}
						/>
					</div>
					<div className="u-margin-top">
						<Button htmlType={HTMLButtonTypes.SUBMIT}>Create</Button>
					</div>
				</form>
			</FormProvider>
		</>
	);
};
