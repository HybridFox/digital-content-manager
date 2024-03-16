import { useEffect } from 'react';
import { generatePath, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes } from '~components';


import { WORKFLOW_PATHS } from '../../workflow.routes';

import { editWorkflowSchema } from './workflow-detail-settings.const';

import { TextField } from '~forms';
import { IAPIError, useHeaderStore, useWorkflowStore } from '~shared';

interface EditWorkflowForm {
	name: string;
	// configuration: any;
}

export const WorkflowDetailSettingsPage = () => {
	const { t } = useTranslation();

	const [workflow] = useWorkflowStore((state) => [state.workflow]);
	const [updateWorkflowLoading, updateWorkflow] = useWorkflowStore((state) => [state.updateWorkflowLoading, state.updateWorkflow]);
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);
	const { workflowId, siteId } = useParams();
	const formMethods = useForm<EditWorkflowForm>({
		resolver: yupResolver(editWorkflowSchema),
		values: workflow,
	});

	const {
		handleSubmit,
		formState: { errors },
		setError,
	} = formMethods;

	useEffect(() => {
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.WORKFLOWS`), to: generatePath(WORKFLOW_PATHS.WORKFLOWS_ROOT, { siteId }) },
			{ label: workflow?.name },
			{ label: t('BREADCRUMBS.SETTINGS') },
		]);
	}, [workflow]);

	const onSubmit = (values: EditWorkflowForm) => {
		if (!workflowId || !workflow) {
			return;
		}

		updateWorkflow(siteId!, workflowId, {
			...values,
			transitions: (workflow.transitions || []).map((transition) => ({
				fromWorkflowStateId: transition.fromState.id,
				toWorkflowStateId: transition.toState.id,
			}))
		}).catch((error: IAPIError) => {
			setError('root', {
				message: error.code,
			});
		});
	};

	return (
		<FormProvider {...formMethods}>
			<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>
				{errors?.root?.message}
			</Alert>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="u-margin-bottom">
					<TextField name="name" label="Name" />
				</div>
				<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>{updateWorkflowLoading && <i className="las la-redo-alt la-spin"></i>} Save</Button>
			</form>
		</FormProvider>
	);
};
