import { FIELD_KEYS, IAPIError, useContentComponentStore, useHeaderStore, useWorkflowStore } from '@ibs/shared';
import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes, Header, Loading } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { TextField, TextareaField } from '@ibs/forms';

import { CONTENT_COMPONENT_PATHS } from '../../content-components.routes';

import { createContentComponentForm } from './cc-create.const';

interface ICreateContentComponent {
	name: string;
	description: undefined | string;
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
	const { siteId } = useParams();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const navigate = useNavigate();
	const formMethods = useForm<ICreateContentComponent>({
		resolver: yupResolver(createContentComponentForm),
	});
	const {
		handleSubmit,
		setError,
		formState: { errors },
	} = formMethods;

	useEffect(() => {
		fetchWorkflows(siteId!, { pagesize: -1 });
		setBreadcrumbs([{ label: 'Content Components', to: CONTENT_COMPONENT_PATHS.ROOT }, { label: 'Create' }]);
	}, []);

	const onSubmit = (values: ICreateContentComponent) => {
		createContentComponent(siteId!, {
			...values,
			componentName: FIELD_KEYS.FIELD_GROUP
		})
			.then((contentComponent) => navigate(generatePath(CONTENT_COMPONENT_PATHS.DETAIL, { contentComponentId: contentComponent.id, siteId })))
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
							<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
								{createContentComponentLoading && <i className="las la-redo-alt la-spin"></i>} Create
							</Button>
						</div>
					</form>
				</Loading>
			</FormProvider>
		</>
	);
};
