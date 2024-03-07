import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

import {
	Button,
	ButtonSizes,
	ButtonTypes,
	Card,
	CardFooter,
	CardMeta,
	HTMLButtonTypes,
	Modal,
	ModalFooter, RenderFields,
} from '~components';

import { CONTENT_PATHS } from '../../content.routes';

import { FIELD_VIEW_MODE, RadioField } from '~forms';
import {
	CONTENT_TYPE_KINDS_TRANSLATIONS,
	DATE_FORMAT,
	IContentItem,
	WORKFLOW_TECHNICAL_STATES,
	useContentRevisionStore,
	useContentStore,
	useContentTypeStore,
	useHeaderStore,
	useWorkflowStore,
} from '~shared';

export const ContentDetailRevisionDetailPage = () => {
	const [contentType] = useContentTypeStore((state) => [state.contentType]);
	const [contentRevision, contentRevisionLoading, fetchContentRevision] = useContentRevisionStore((state) => [
		state.contentRevision,
		state.contentRevisionLoading,
		state.fetchContentRevision,
	]);
	const [restoreModalVisible, setRestoreModalVisible] = useState(false);
	const navigate = useNavigate();
	const workflowStateFormMethods = useForm<{ workflowStateId: string }>({
		values: {
			workflowStateId: contentRevision?.workflowStateId || '',
		},
	});
	const [updateContentItem, updateContentItemLoading] = useContentStore((state) => [state.updateContentItem, state.updateContentItemLoading]);
	const [contentItem] = useContentStore((state) => [state.contentItem]);
	const [workflow] = useWorkflowStore((state) => [state.workflow]);
	const { t } = useTranslation();
	const { siteId, contentId, revisionId, kind } = useParams();
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);
	const formMethods = useForm<IContentItem>({
		// resolver: yupResolver(editContentItemSchema),
		values: contentItem,
	});

	useEffect(() => {
		fetchContentRevision(siteId!, contentId!, revisionId!);
	}, []);

	useEffect(() => {
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.${contentType?.kind?.toUpperCase()}`), to: CONTENT_PATHS.ROOT },
			{
				label: contentType?.name,
				badge: contentType && CONTENT_TYPE_KINDS_TRANSLATIONS[contentType.kind],
			},
			{ label: t('BREADCRUMBS.REVISIONS'), to: generatePath(CONTENT_PATHS.DETAIL_REVISIONS, { siteId, contentId, kind }) },
		]);
	}, [contentItem, contentType]);

	const onSubmit = ({ workflowStateId }: { workflowStateId: string }) => {
		if (!contentItem) {
			return;
		}

		updateContentItem(siteId!, contentItem.id, {
			...contentItem,
			workflowStateId,
			fields: contentRevision?.fields || {},
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

	const { handleSubmit } = workflowStateFormMethods;

	return (
		<>
			<FormProvider {...formMethods}>
				<Card className="u-margin-bottom">
					<CardMeta
						items={[
							{
								label: 'Created at',
								value: dayjs(contentRevision?.createdAt).format(DATE_FORMAT),
							},
							{ label: 'Status', value: contentRevision?.workflowState?.name },
							{ label: 'Editor', value: contentRevision?.user?.name },
						]}
					/>
					<CardFooter>
						<Button size={ButtonSizes.SMALL} type={ButtonTypes.SECONDARY} onClick={() => setRestoreModalVisible(true)}>
							<span className="las la-undo"></span> Restore
						</Button>
					</CardFooter>
				</Card>
				<form style={{ height: '100%' }}>
					<RenderFields viewMode={FIELD_VIEW_MODE.VIEW} siteId={siteId!} fieldPrefix="fields." fields={contentType?.fields || []} />
				</form>
			</FormProvider>
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
