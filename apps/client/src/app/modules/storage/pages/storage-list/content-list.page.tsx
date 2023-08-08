import { useEffect } from 'react';
import { useHeaderStore } from '@ibs/shared';
import { ButtonLink, Header, Loading, Table } from '@ibs/components';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useContentStore } from '../../stores/content';

import { CONTENT_LIST_COLUMNS } from './content-list.const';

export const ContentListPage = () => {
	const [content, contentLoading, fetchContent] = useContentStore((state) => [state.content, state.contentLoading, state.fetchContent]);
	const { t } = useTranslation();
	const { kind } = useParams();
	const [breadcrumbs, setBreadcrumbs] =
		useHeaderStore((state) => [
			state.breadcrumbs,
			state.setBreadcrumbs
		]);

	useEffect(() => {
		console.log(kind);
		fetchContent({ kind: kind?.toUpperCase().replace('-', '_') });
		setBreadcrumbs([{ label: t(`BREADCRUMBS.${kind?.toUpperCase()}`) }])
	}, [kind]);

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t(`PAGES.TITLES.ALL_${kind?.toUpperCase()}`)}
				action={
					<ButtonLink to="create">
						<span className="las la-plus"></span> {t(`PAGES.ACTIONS.CREATE_${kind?.toUpperCase()}`)}
					</ButtonLink>
				}
			></Header>
			<Loading
				loading={contentLoading}
				text={t(`GENERAL.LOADING`)}
			>
				<Table
					columns={CONTENT_LIST_COLUMNS(t)}
					rows={content || []}
				></Table>
			</Loading>
		</>
	);
};
