import { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import cx from 'classnames/bind';
import dayjs from 'dayjs';

import {
	Alert,
	AlertTypes,
	Button,
	ButtonSizes,
	ButtonTypes,
	Card,
	CardFooter,
	CardMeta,
	HTMLButtonTypes,
	Loading,
	Modal,
	ModalFooter,
	RenderComparison,
} from '~components';

import { CONTENT_PATHS } from '../../content.routes';

import styles from './content-detail-revision.compare.module.scss';

import { FIELD_VIEW_MODE, RadioField } from '~forms';
import {
	CONTENT_TYPE_KINDS_TRANSLATIONS,
	DATE_FORMAT,
	IAPIError,
	IContentRevision,
	useContentRevisionStore,
	useContentStore,
	useContentTypeStore,
	useHeaderStore,
	useWorkflowStore,
	WORKFLOW_TECHNICAL_STATES,
} from '~shared';

const cxBind = cx.bind(styles);

export const ContentDetailRevisionComparePage = () => {
	const [contentType] = useContentTypeStore((state) => [state.contentType]);
	const [contentRevisionComparison, contentRevisionComparisonLoading, fetchContentRevisionComparison] = useContentRevisionStore((state) => [
		state.contentRevisionComparison,
		state.contentRevisionComparisonLoading,
		state.fetchContentRevisionComparison,
	]);
	const [updateContentItem, updateContentItemLoading] = useContentStore((state) => [state.updateContentItem, state.updateContentItemLoading]);
	const [restoreModalVisible, setRestoreModalVisible] = useState(false);
	const [workflow] = useWorkflowStore((state) => [state.workflow, state.workflowLoading]);
	const [contentItem] = useContentStore((state) => [state.contentItem]);
	const { t } = useTranslation();
	const { siteId, contentId, firstRevisionId, secondRevisionId, kind } = useParams();
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);
	const compareFormMethods = useForm<[IContentRevision, IContentRevision]>({
		values: contentRevisionComparison,
	});
	const navigate = useNavigate();
	const workflowStateFormMethods = useForm<{ workflowStateId: string }>({
		values: {
			workflowStateId: contentRevisionComparison?.[1]?.workflowStateId || '',
		},
	});

	const { handleSubmit } = workflowStateFormMethods;

	useEffect(() => {
		fetchContentRevisionComparison(siteId!, contentId!, firstRevisionId!, secondRevisionId!);
	}, []);

	useEffect(() => {
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.${contentType?.kind?.toUpperCase()}`), to: CONTENT_PATHS.ROOT },
			{
				label: contentType?.name,
				badge: contentType && CONTENT_TYPE_KINDS_TRANSLATIONS[contentType.kind],
			},
			{
				label: t('BREADCRUMBS.REVISIONS'),
				to: generatePath(CONTENT_PATHS.DETAIL_REVISIONS, { siteId, contentId, kind }),
			},
		]);
	}, [contentItem, contentType]);

	const onSubmit = ({ workflowStateId }: { workflowStateId: string }) => {
		if (!contentItem) {
			return;
		}

		updateContentItem(siteId!, contentItem.id, {
			...contentItem,
			workflowStateId,
			fields: contentRevisionComparison?.[1]?.fields || {},
		}).then(() => {
			setRestoreModalVisible(false);
			navigate(generatePath(CONTENT_PATHS.DETAIL_FIELDS, { contentId, kind, siteId }));
		});
	};

	const statusOptions = useMemo(() => {
		return (workflow?.transitions || [])
			.filter((transition) => (contentItem?.published ? true : transition.toState.technicalState !== WORKFLOW_TECHNICAL_STATES.UNPUBLISHED))
			.filter((transition) => transition.fromState.id === contentItem?.workflowStateId)
			.sort((a, b) => (a.fromState.name < b.fromState.name ? -1 : 1))
			.map((transition) => ({
				label: transition.toState.name,
				value: transition.toState.id,
			}));
	}, [workflow]);

	return (
		<>
			<Loading loading={contentRevisionComparisonLoading}>
				<div className={cxBind('p-revision-compare')}>
					<div className={cxBind('p-revision-compare__left')}>
						<Card className="u-margin-bottom">
							<CardMeta
								items={[
									{
										label: 'Created at',
										value: dayjs(contentRevisionComparison?.[0]?.createdAt).format(DATE_FORMAT),
									},
									{ label: 'Status', value: contentRevisionComparison?.[0]?.workflowState?.name },
									{ label: 'Editor', value: contentRevisionComparison?.[0]?.user?.name },
								]}
							/>
							<CardFooter>
								<Button
									disabled={contentRevisionComparison?.[0]?.id === contentItem?.revisionId}
									size={ButtonSizes.SMALL}
									type={ButtonTypes.SECONDARY}
								>
									<span className="las la-undo"></span> Restore
								</Button>
							</CardFooter>
						</Card>
					</div>
					<div className={cxBind('p-revision-compare__right')}>
						<Card className="u-margin-bottom">
							<CardMeta
								items={[
									{
										label: 'Created at',
										value: dayjs(contentRevisionComparison?.[1]?.createdAt).format(DATE_FORMAT),
									},
									{ label: 'Status', value: contentRevisionComparison?.[1]?.workflowState?.name },
									{ label: 'Editor', value: contentRevisionComparison?.[1]?.user?.name },
								]}
							/>
							<CardFooter>
								<Button
									disabled={contentRevisionComparison?.[1]?.id === contentItem?.revisionId}
									size={ButtonSizes.SMALL}
									type={ButtonTypes.SECONDARY}
									onClick={() => setRestoreModalVisible(true)}
								>
									<span className="las la-undo"></span> Restore
								</Button>
							</CardFooter>
						</Card>
					</div>
				</div>
				<FormProvider {...compareFormMethods}>
					<RenderComparison viewMode={FIELD_VIEW_MODE.VIEW} siteId={siteId!} fieldPrefix="fields." fields={contentType?.fields || []} />
				</FormProvider>
			</Loading>
			<Modal modalOpen={restoreModalVisible} title="Restore as..." onClose={() => setRestoreModalVisible(false)}>
				<FormProvider {...workflowStateFormMethods}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<RadioField
							name="workflowStateId"
							label="Workflow State"
							fieldConfiguration={{
								options: statusOptions,
							}}
						></RadioField>
						<ModalFooter>
							<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
								{updateContentItemLoading && <i className="las la-redo-alt la-spin"></i>} Restore
							</Button>
						</ModalFooter>
					</form>
				</FormProvider>
			</Modal>
		</>
	);
};
