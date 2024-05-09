import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes, Header, Loading } from '~components';
import { TextField, TextareaField } from '~components';

import { CONTENT_COMPONENT_PATHS } from '../../content-components.routes';

import { createContentComponentForm } from './cc-create.const';

import { FieldKeys, IAPIError, useContentComponentStore, useHeaderStore, useWorkflowStore } from '~shared';

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
		setBreadcrumbs([{ label: 'Content Components', to: generatePath(CONTENT_COMPONENT_PATHS.ROOT, { siteId }) }, { label: 'Create' }]);
	}, []);

	const onSubmit = (values: ICreateContentComponent) => {
		createContentComponent(siteId!, {
			...values,
			componentName: FieldKeys.FIELD_GROUP
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
