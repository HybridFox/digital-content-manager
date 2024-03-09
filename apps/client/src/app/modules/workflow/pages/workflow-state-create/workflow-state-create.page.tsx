import { useEffect } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes, Header } from '~components';

import { useWorkflowStateStore } from '../../stores/workflow-state';
import { WORKFLOW_PATHS } from '../../workflow.routes';
import { WORKFLOW_STATE_TECHNICAL_STATE_OPTIONS } from '../../workflow.const';

import { createWorkflowStateSchema } from './workflow-state-create.const';

import { SelectField, TextField, TextareaField } from '~forms';
import {
	IAPIError,
	WORKFLOW_TECHNICAL_STATES,
	useHeaderStore,
} from '~shared';

interface CreateWorkflowStateForm {
	name: string;
	description: undefined | string | null;
	technicalState: WORKFLOW_TECHNICAL_STATES;
}

export const WorkflowStateCreatePage = () => {
	const [createWorkflowState, createWorkflowStateLoading] = useWorkflowStateStore((state) => [
		state.createWorkflowState,
		state.createWorkflowStateLoading,
	]);
	const navigate = useNavigate();
	const { siteId } = useParams();
	const { t } = useTranslation();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const formMethods = useForm<CreateWorkflowStateForm>({
		resolver: yupResolver(createWorkflowStateSchema)
	});

	const {
		handleSubmit,
		formState: { errors },
		setError,
	} = formMethods;

	useEffect(() => {
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.WORKFLOW_STATES`), to: WORKFLOW_PATHS.WORKFLOW_STATES_ROOT },
			{ label: t(`BREADCRUMBS.CREATE`) },
		]);
	}, []);

	const onSubmit = (values: CreateWorkflowStateForm) => {
		createWorkflowState(siteId!, values)
			.then((storageRepository) => navigate(generatePath(WORKFLOW_PATHS.WORKFLOW_STATES_DETAIL, { siteId, storageRepositoryId: storageRepository.id })))
			.catch((error: IAPIError) => {
				setError('root', {
					message: error.code,
				});
			});
	};

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t('WORKFLOW_STATES.TITLES.CREATE')}
			></Header>
			<div className="u-margin-top">
				<FormProvider {...formMethods}>
					<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>
						{errors?.root?.message}
					</Alert>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="u-margin-bottom">
							<TextField name="name" label="Name" />
						</div>
						<div className="u-margin-bottom">
							<TextareaField name="description" label="Description" />
						</div>
						<div className="u-margin-bottom">
							<SelectField name="technicalState" label="Technical State" fieldConfiguration={{ options: WORKFLOW_STATE_TECHNICAL_STATE_OPTIONS }} />
						</div>
						<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
							{createWorkflowStateLoading && <i className="las la-redo-alt la-spin"></i>} Save
						</Button>
					</form>
				</FormProvider>
			</div>
		</>
	);
};
