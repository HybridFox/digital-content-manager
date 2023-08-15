import { useEffect } from 'react';
import { CONTENT_TYPE_KINDS_PARAMETER_MAP, useHeaderStore } from '@ibs/shared';
import { ButtonLink, ButtonTypes, HasPermission, Header, Loading, Table } from '@ibs/components';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useContentStore } from '../../stores/content';

import { CONTENT_LIST_COLUMNS } from './content-list.const';

export const ContentListPage = () => {
	const [content, contentLoading, fetchContent] = useContentStore((state) => [state.content, state.contentLoading, state.fetchContent]);
	const [removeContentItemLoading, removeContentItem] = useContentStore((state) => [state.removeContentItemLoading, state.removeContentItem]);
	const { t } = useTranslation();
	const { kind, siteId } = useParams();
	const [breadcrumbs, setBreadcrumbs] =
		useHeaderStore((state) => [
			state.breadcrumbs,
			state.setBreadcrumbs
		]);

	useEffect(() => {
		if (!kind) {
			return;
		}

		fetchContent(siteId!, { kind: CONTENT_TYPE_KINDS_PARAMETER_MAP[kind] });
		setBreadcrumbs([{ label: t(`BREADCRUMBS.${kind?.toUpperCase()}`) }])
	}, [kind]);

	const handleDelete = (contentItemId: string): void => {
		removeContentItem(siteId!, contentItemId)
			.then(() => fetchContent(siteId!, { kind: CONTENT_TYPE_KINDS_PARAMETER_MAP[kind!] }))
	}

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t(`CONTENT.TITLES.LIST_${kind?.toUpperCase()}`)}
				action={
					<HasPermission siteId={siteId} resource='urn:ibs::*' action={`sites::${kind}:create`}>
						<ButtonLink to="create" type={ButtonTypes.PRIMARY}>
							<span className="las la-plus"></span> {t(`CONTENT.ACTIONS.CREATE_${kind?.toUpperCase()}`)}
						</ButtonLink>
					</HasPermission>
				}
			></Header>
			<Loading
				loading={contentLoading}
				text={t(`GENERAL.LOADING`)}
			>
				<Table
					columns={CONTENT_LIST_COLUMNS(t, handleDelete)}
					rows={content || []}
				></Table>
			</Loading>
		</>
	);
};
