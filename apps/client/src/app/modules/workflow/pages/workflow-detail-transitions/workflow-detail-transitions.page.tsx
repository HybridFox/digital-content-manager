import { IWorkflowTransition, generateUuid, useHeaderStore, useWorkflowStore } from '@ibs/shared';
import { useEffect, useState } from 'react';
import { Button, Card, HTMLButtonTypes, Loading, Table } from '@ibs/components';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { SelectField } from '@ibs/forms';
import { useParams } from 'react-router-dom';

import { WORKFLOW_PATHS } from '../../workflow.routes';
import { useWorkflowStateStore } from '../../stores/workflow-state';

import { WORKFLOW_TRANSITIONS_COLUMNS } from './workflow-detail-transitions.const';

interface AddWorkflowTransitionForm {
	fromStateId: string;
	toStateId: string;
}

export const WorkflowDetailTransitionsPage = () => {
	const [transitions, setTransitions] = useState<IWorkflowTransition[]>([]);
	const { t } = useTranslation();
	const formMethods = useForm<AddWorkflowTransitionForm>();
	const [workflow] = useWorkflowStore((state) => [state.workflow]);
	const [updateWorkflowLoading, updateWorkflow] = useWorkflowStore((state) => [state.updateWorkflowLoading, state.updateWorkflow]);
	const [workflowStates, workflowStatesLoading, fetchWorkflowStates] = useWorkflowStateStore((state) => [
		state.workflowStates,
		state.workflowStatesLoading,
		state.fetchWorkflowStates,
	]);
	const { siteId } = useParams();
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);
	const { handleSubmit, reset } = formMethods;

	useEffect(() => {
		fetchWorkflowStates(siteId!);
	}, []);

	useEffect(() => {
		setTransitions(workflow?.transitions || []);
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.WORKFLOWS`), to: WORKFLOW_PATHS.WORKFLOWS_ROOT },
			{ label: workflow?.name },
			{ label: t('BREADCRUMBS.TRANSITIONS') },
		]);
	}, [workflow]);

	const onRemoveTransition = (transitionId: string) => {
		setTransitions((transitions) => [
			...transitions.filter((transition) => transition.id !== transitionId)
		]);
		reset();
	};

	const onAddTransition = (values: AddWorkflowTransitionForm) => {
		const fromState = workflowStates.find(({ id }) => values.fromStateId === id);
		const toState = workflowStates.find(({ id }) => values.toStateId === id);

		if (!fromState || !toState) {
			return;
		}

		setTransitions((transitions) => [
			...transitions,
			{
				id: generateUuid(),
				fromState,
				toState,
			},
		]);
		reset();
	};

	const handleUpdateWorkflow = () => {
		if (!workflow) {
			return;
		}

		updateWorkflow(siteId!, workflow.id, {
			...workflow,
			transitions: transitions.map((transition) => ({
				fromWorkflowStateId: transition.fromState.id,
				toWorkflowStateId: transition.toState.id,
			}))
		})
	};

	const rows = transitions.sort((a, b) => (a.fromState.name < b.fromState.name ? -1 : 1));

	return (
		<>
			<Table columns={WORKFLOW_TRANSITIONS_COLUMNS(t, onRemoveTransition)} rows={rows} />
			<Loading loading={workflowStatesLoading}>
				<Card className="u-margin-top">
					<h5>Add transition</h5>
					<FormProvider {...formMethods}>
						<form onSubmit={handleSubmit(onAddTransition)} className="u-margin-top-sm">
							<div className="u-row">
								<div className="u-col-md-5">
									<SelectField
										name="fromStateId"
										label="From State"
										fieldConfiguration={{
											options: workflowStates.map((state) => ({
												label: state.name,
												value: state.id,
											})),
										}}
									></SelectField>
								</div>
								<div className="u-col-md-5">
									<SelectField
										name="toStateId"
										label="To State"
										fieldConfiguration={{
											options: workflowStates.map((state) => ({
												label: state.name,
												value: state.id,
											})),
										}}
									></SelectField>
								</div>
								<div className="u-col-md-2 u-col--align-end">
									<Button htmlType={HTMLButtonTypes.SUBMIT} block>
										<span className="las la-plus"></span> Add
									</Button>
								</div>
							</div>
						</form>
					</FormProvider>
				</Card>
			</Loading>
			<div className="u-margin-top">
				<Button htmlType={HTMLButtonTypes.SUBMIT} onClick={handleUpdateWorkflow}>
					{updateWorkflowLoading && <i className="las la-redo-alt la-spin"></i>} Save
				</Button>
			</div>
		</>
	);
};
