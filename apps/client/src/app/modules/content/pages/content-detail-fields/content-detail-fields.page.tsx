import {
	CONTENT_TYPE_KINDS_TRANSLATIONS,
	IAPIError,
	IContentItem,
	WORKFLOW_TECHNICAL_STATES,
	useContentStore,
	useContentTypeStore,
	useHeaderStore,
	useWorkflowStore,
	DATE_FORMAT,
} from '@ibs/shared';
import { useEffect, useMemo } from 'react';
import { RadioField, RenderFields } from '@ibs/forms';
import { useTranslation } from 'react-i18next';
import { Alert, AlertTypes, Button, ButtonSizes, ButtonTypes, Card, CardFooter, CardMeta, HTMLButtonTypes } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import cx from 'classnames/bind';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';

import { CONTENT_PATHS } from '../../content.routes';
import { useWorkflowStateStore } from '../../../workflow/stores/workflow-state';

import styles from './content-detail-fields.module.scss';
import { editContentItemSchema } from './content-detail-fields.const';

const cxBind = cx.bind(styles);

export const ContentDetailFieldsPage = () => {
	const [workflowStates, workflowStatesLoading, fetchWorkflowStates] = useWorkflowStateStore((state) => [
		state.workflowStates,
		state.workflowStatesLoading,
		state.fetchWorkflowStates,
	]);
	const [contentType] = useContentTypeStore((state) => [state.contentType]);
	const [content] = useContentStore((state) => [state.contentItem]);
	const [updateContentItem, updateContentItemLoading] = useContentStore((state) => [state.updateContentItem, state.updateContentItemLoading]);
	const [contentItem] = useContentStore((state) => [state.contentItem]);
	const [workflow] = useWorkflowStore((state) => [state.workflow]);
	const { t } = useTranslation();
	const { siteId } = useParams();
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);
	const formMethods = useForm<IContentItem>({
		// resolver: yupResolver(editContentItemSchema),
		values: contentItem,
	});

	const {
		handleSubmit,
		formState: { errors },
		setError,
		watch,
	} = formMethods;

	useEffect(() => {
		fetchWorkflowStates(siteId!, { pagesize: -1 });
	}, []);

	useEffect(() => {
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.${contentType?.kind?.toUpperCase()}`), to: CONTENT_PATHS.ROOT },
			{
				label: contentType?.name,
				badge: contentType && CONTENT_TYPE_KINDS_TRANSLATIONS[contentType.kind],
			},
			{ label: 'Fields' },
		]);
	}, [contentItem, contentType]);

	const onSubmit = (values: IContentItem) => {
		if (!contentItem) {
			return;
		}

		updateContentItem(siteId!, contentItem.id, values).catch((error: IAPIError) => {
			setError('root', {
				message: error.code,
			});
		});
	};

	const workflowStateId = watch('workflowStateId');

	const technicalState = useMemo(() => {
		return workflowStates.find((state) => state.id === workflowStateId)?.technicalState;
	}, [workflowStateId, workflowStates]);

	const statusOptions = useMemo(() => {
		return (workflow?.transitions || [])
			.filter((transition) => (contentItem?.published ? true : transition.toState.technicalState !== WORKFLOW_TECHNICAL_STATES.UNPUBLISHED))
			.filter((transition) => transition.fromState.id === contentItem?.workflowStateId)
			.sort((a, b) => (a.fromState.name < b.fromState.name ? -1 : 1))
			.map((transition) => ({
				label: transition.toState.name,
				value: transition.toState.id,
			}));
	}, [workflow, contentItem]);

	return (
		<FormProvider {...formMethods}>
			<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>
				{errors?.root?.message}
			</Alert>
			<form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%' }}>
				<div className={cxBind('p-content-detail')}>
					<div className={cxBind('p-content-detail__fields')}>
						<RenderFields siteId={siteId!} fieldPrefix="fields." fields={contentType?.fields || []} />
					</div>
					<div className={cxBind('p-content-detail__status')}>
						<Card className="u-margin-bottom">
							<CardMeta
								items={[
									{
										label: 'Item Online',
										value: content?.published ? (
											<span className="las la-check u-text--success"></span>
										) : (
											<span className="las la-times u-text--danger"></span>
										),
									},
									{ label: 'Revision status', value: contentItem?.currentWorkflowState?.name },
									{
										label: (
											<RadioField
												label="New status"
												name="workflowStateId"
												fieldConfiguration={{ options: statusOptions }}
											></RadioField>
										),
									},
								]}
							/>
							<CardFooter>
								<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT} block>
									{updateContentItemLoading && <i className="las la-redo-alt la-spin"></i>}{' '}
									{technicalState === WORKFLOW_TECHNICAL_STATES.PUBLISHED && 'Publish'}
									{technicalState === WORKFLOW_TECHNICAL_STATES.UNPUBLISHED && 'Unpublish'}
									{technicalState === WORKFLOW_TECHNICAL_STATES.DRAFT && 'Save draft'}
								</Button>
							</CardFooter>
						</Card>
					</div>
				</div>
			</form>
		</FormProvider>
	);
};
