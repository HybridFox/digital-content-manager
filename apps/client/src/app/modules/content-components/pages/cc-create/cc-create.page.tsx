import { FIELD_KEYS, IAPIError, useContentComponentStore, useHeaderStore, useWorkflowStore } from '@ibs/shared';
import { Alert, AlertTypes, Button, HTMLButtonTypes, Header, Loading } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { generatePath, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { SelectField, TextField, TextareaField } from '@ibs/forms';

import { CONTENT_COMPONENTS_PATHS } from '../../content-components.routes';

import { createContentComponentForm } from './cc-create.const';

interface ICreateContentComponent {
	name: string;
	description: undefined | string;
	workflowId: string;
}

export const CCCreatePage = () => {
	const [createContentComponentLoading, createContentComponent] = useContentComponentStore((state) => [
		state.createContentComponentLoading,
		state.createContentComponent,
	]);
	const [workflows, workflowsLoading, fetchWorkflows] = useWorkflowStore((state) => [
		state.workflows,
		state.workflowsLoading,
		state.fetchWorkflows,
	]);
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const navigate = useNavigate();
	const formMethods = useForm<ICreateContentComponent>({
		resolver: yupResolver(createContentComponentForm),
		values: { workflowId: workflows?.[0]?.id, description: '', name: '' },
	});
	const {
		handleSubmit,
		setError,
		formState: { errors },
	} = formMethods;

	useEffect(() => {
		fetchWorkflows({ pagesize: -1 });
		setBreadcrumbs([{ label: 'Content Components', to: CONTENT_COMPONENTS_PATHS.ROOT }, { label: 'Create' }]);
	}, []);

	const onSubmit = (values: ICreateContentComponent) => {
		createContentComponent({
			...values,
			componentName: FIELD_KEYS.FIELD_GROUP
		})
			.then((contentComponent) => navigate(generatePath(CONTENT_COMPONENTS_PATHS.DETAIL, { contentComponentId: contentComponent.id })))
			.catch((error: IAPIError) => {
				setError('root', {
					message: error.code,
				});
			});
	};

	return (
		<>
			<Header title="Create content component" breadcrumbs={breadcrumbs}></Header>
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
							<Button htmlType={HTMLButtonTypes.SUBMIT}>
								{createContentComponentLoading && <i className="las la-redo-alt la-spin"></i>} Create
							</Button>
						</div>
					</form>
				</Loading>
			</FormProvider>
		</>
	);
};
