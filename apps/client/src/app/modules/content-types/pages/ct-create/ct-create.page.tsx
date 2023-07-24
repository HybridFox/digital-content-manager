import { IAPIError, useContentTypeStore } from '@ibs/shared';
import { Alert, AlertTypes, Button, HTMLButtonTypes, Header, TextInput, TextareaInput } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';

import { createContentTypeForm } from './ct-create.const';

interface ICreateContentTypeForm {
	name: string;
	description: string;
}

export const CTCreatePage = () => {
	const formMethods = useForm<ICreateContentTypeForm>({ resolver: yupResolver(createContentTypeForm) });
	const [createContentType] = useContentTypeStore((state) => [state.createContentType]);
	const navigate = useNavigate();

	const { handleSubmit, setError, formState: { errors } } = formMethods;

	const onSubmit = (values: ICreateContentTypeForm) => {
		createContentType(values)
			.then((contentType) => navigate(`../content-types/${contentType.id}`))
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
				subTitle="Content types"
			></Header>
			<FormProvider {...formMethods}>
				<form className='u-margin-top' onSubmit={handleSubmit(onSubmit)}>
					<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>{errors?.root?.message}</Alert>
					<TextInput
						name="name"
						label='Name'
					></TextInput>
					<div className="u-margin-top">
						<TextareaInput
							name="description"
							label="Description"
						></TextareaInput>
					</div>
					<div className="u-margin-top">
						<Button htmlType={HTMLButtonTypes.SUBMIT}>Create</Button>
					</div>
				</form>
			</FormProvider>
		</>
	);
};
