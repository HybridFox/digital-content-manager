import { CONTENT_TYPE_KINDS_OPTIONS, IAPIError, useContentTypeStore, useHeaderStore, useWorkflowStore } from '@ibs/shared';
import { Alert, AlertTypes, Button, HTMLButtonTypes, Header, Loading } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { SelectField, TextField, TextareaField } from '@ibs/forms';

import { CONTENT_TYPES_PATHS } from '../../content-types.routes';

import { createContentTypeForm } from './ct-create.const';

interface ICreateContentTypeForm {
	name: string;
	description: string;
	workflowId: string;
	kind: string;
}

export const CTCreatePage = () => {
	const [createContentType] = useContentTypeStore((state) => [state.createContentType]);
	const [workflows, workflowsLoading, fetchWorkflows] = useWorkflowStore((state) => [
		state.workflows,
		state.workflowsLoading,
		state.fetchWorkflows,
	]);
	const { siteId } = useParams();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const navigate = useNavigate();
	const formMethods = useForm<ICreateContentTypeForm>({
		resolver: yupResolver(createContentTypeForm),
		values: { workflowId: workflows?.[0]?.id, kind: CONTENT_TYPE_KINDS_OPTIONS[0].value, description: '', name: '' },
	});
	const {
		handleSubmit,
		setError,
		formState: { errors },
	} = formMethods;

	useEffect(() => {
		fetchWorkflows(siteId!, { pagesize: -1 });
		setBreadcrumbs([{ label: 'Content Types', to: CONTENT_TYPES_PATHS.ROOT }, { label: 'Create' }]);
	}, []);

	const onSubmit = (values: ICreateContentTypeForm) => {
		createContentType(siteId!, values)
			.then((contentType) => navigate(generatePath(CONTENT_TYPES_PATHS.DETAIL, { contentTypeId: contentType.id, siteId })))
			.catch((error: IAPIError) => {
				setError('root', {
					message: error.code,
				});
			});
	};

	return (
		<>
			<Header title="Create content type" breadcrumbs={breadcrumbs}></Header>
			<FormProvider {...formMethods}>
				<Loading loading={workflowsLoading}>
					<form className="u-margin-top" onSubmit={handleSubmit(onSubmit)}>
						<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>
							{errors?.root?.message}
						</Alert>
						<TextField name="name" label="Name"></TextField>
						<div className="u-margin-top">
							<TextareaField name="description" label="Description"></TextareaField>
						</div>
						<div className="u-margin-top">
							<SelectField
								name="workflowId"
								label="Workflow"
								fieldConfiguration={{ options: (workflows || []).map((workflow) => ({ label: workflow.name, value: workflow.id })) }}
							/>
						</div>
						<div className="u-margin-top">
							<SelectField name="kind" label="Content Type Kind" fieldConfiguration={{ options: CONTENT_TYPE_KINDS_OPTIONS }} />
						</div>
						<div className="u-margin-top">
							<Button htmlType={HTMLButtonTypes.SUBMIT}>Create</Button>
						</div>
					</form>
				</Loading>
			</FormProvider>
		</>
	);
};
