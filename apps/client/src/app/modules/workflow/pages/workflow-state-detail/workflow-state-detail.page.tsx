import { useEffect } from 'react';
import { generatePath, useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes, Header, Loading } from '~components';

import { useWorkflowStateStore } from '../../stores/workflow-state';
import { WORKFLOW_PATHS } from '../../workflow.routes';
import { WORKFLOW_STATE_TECHNICAL_STATE_OPTIONS } from '../../workflow.const';

import { editWorkflowStateSchema } from './workflow-state-detail.const';

import { SelectField, TextField, TextareaField } from '~forms';
import { IAPIError, WorkflowTechnicalStates, useHeaderStore } from '~shared';

interface EditWorkflowStateForm {
	name: string;
	description: undefined | string | null;
	technicalState: WorkflowTechnicalStates;
}

export const WorkflowStateDetailPage = () => {
	const { t } = useTranslation();

	const [workflowState, workflowStateLoading, fetchWorkflowState] = useWorkflowStateStore((state) => [
		state.workflowState,
		state.workflowStateLoading,
		state.fetchWorkflowState,
	]);
	const [updateWorkflowStateLoading, updateWorkflowState] = useWorkflowStateStore((state) => [
		state.updateWorkflowStateLoading,
		state.updateWorkflowState,
	]);
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const { workflowStateId, siteId } = useParams();
	const formMethods = useForm<EditWorkflowStateForm>({
		resolver: yupResolver(editWorkflowStateSchema),
		values: workflowState,
	});

	const {
		handleSubmit,
		formState: { errors },
		setError,
	} = formMethods;

	useEffect(() => {
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.WORKFLOW_STATES`), to: generatePath(WORKFLOW_PATHS.WORKFLOW_STATES_ROOT, { siteId }) },
			{ label: t(`BREADCRUMBS.EDIT`) },
		]);
	}, [workflowState]);

	useEffect(() => {
		if (!workflowStateId) {
			return;
		}

		fetchWorkflowState(siteId!, workflowStateId);
	}, [workflowStateId]);

	const onSubmit = (values: EditWorkflowStateForm) => {
		if (!workflowStateId) {
			return;
		}

		updateWorkflowState(siteId!, workflowStateId, values).catch((error: IAPIError) => {
			setError('root', {
				message: error.code,
			});
		});
	};

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={<Trans t={t} i18nKey="WORKFLOW_STATES.TITLES.EDIT" values={{ workflowStateName: workflowState?.name }} />}
			></Header>
			<div className="u-margin-top">
				<Loading loading={workflowStateLoading} text="Loading data...">
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
								<SelectField
									name="technicalState"
									label="Technical State"
									fieldConfiguration={{ options: WORKFLOW_STATE_TECHNICAL_STATE_OPTIONS }}
								/>
							</div>
							<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
								{updateWorkflowStateLoading && <i className="las la-redo-alt la-spin"></i>} Save
							</Button>
						</form>
					</FormProvider>
				</Loading>
			</div>
		</>
	);
};
