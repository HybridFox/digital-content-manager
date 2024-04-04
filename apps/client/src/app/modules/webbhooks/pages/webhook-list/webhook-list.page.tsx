import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';

import { ButtonLink, ButtonTypes, Header, Loading, Pagination, Table } from '~components';

import { WEBHOOKS_LIST_COLUMNS } from './webhook-list.const';

import { getPageParams, getPaginationProps, useHeaderStore, useWebhookStore } from '~shared';

export const WebhookListPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [webhooks, webhooksPagination, webhooksLoading, fetchWebhooks] = useWebhookStore((state) => [
		state.webhooks,
		state.webhooksPagination,
		state.webhooksLoading,
		state.fetchWebhooks,
	]);
	const [removeWebhook, removeWebhookLoading] = useWebhookStore((state) => [
		state.removeWebhook,
		state.removeWebhookLoading,
	]);
	const { t } = useTranslation();
	const { siteId } = useParams();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);

	useEffect(() => {
		setBreadcrumbs([{ label: t(`BREADCRUMBS.WEBHOOKS`) }]);
	}, [siteId]);

	useEffect(() => {
		fetchWebhooks(siteId!, { ...getPageParams(searchParams) });
	}, [searchParams, siteId]);

	const handleDelete = (webhookId: string) => {
		removeWebhook(siteId!, webhookId);
	}

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t(`WEBHOOKS.TITLES.LIST`)}
				action={
					<ButtonLink to="create" type={ButtonTypes.PRIMARY}>
						<span className="las la-plus"></span> {t(`WEBHOOKS.ACTIONS.CREATE`)}
					</ButtonLink>
				}
			></Header>
			<Loading loading={webhooksLoading} text={t(`GENERAL.LABELS.LOADING`)}>
				<Table columns={WEBHOOKS_LIST_COLUMNS(t, handleDelete, removeWebhookLoading)} rows={webhooks || []}></Table>
				<Pagination
					className="u-margin-top"
					totalPages={webhooksPagination?.totalPages}
					number={webhooksPagination?.number}
					size={webhooksPagination?.size}
					{...getPaginationProps(searchParams, setSearchParams)}
				/>
			</Loading>
		</>
	);
};
