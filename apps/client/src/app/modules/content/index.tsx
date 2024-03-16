import { Navigate, RouteObject } from 'react-router-dom';

import { CONTENT_PATHS } from './content.routes';

export const CONTENT_ROUTES: RouteObject[] = [
	{
		path: CONTENT_PATHS.ROOT,
		lazy: async () => ({ Component: (await import('./pages/content-list/content-list.page')).ContentListPage }),
	},
	{
		path: CONTENT_PATHS.CREATE,
		lazy: async () => ({ Component: (await import('./pages/content-create/content-create.page')).ContentCreatePage }),
	},
	{
		path: CONTENT_PATHS.CREATE_DETAIL,
		lazy: async () => ({ Component: (await import('./pages/content-create-detail/content-create-detail.page')).ContentCreateDetailPage }),
	},
	{
		path: CONTENT_PATHS.ROOT_DETAIL,
		element: <Navigate to="content" />,
	},
	{
		path: CONTENT_PATHS.DETAIL,
		lazy: async () => ({ Component: (await import('./pages/content-detail/content-detail.page')).ContentDetailPage }),
		children: [
			{
				path: '',
				element: <Navigate to="fields" />,
			},
			{
				path: CONTENT_PATHS.DETAIL_SETTINGS,
				lazy: async () => ({ Component: (await import('./pages/content-detail-settings/content-detail-settings.page')).ContentDetailSettingsPage }),
			},
			{
				path: CONTENT_PATHS.DETAIL_FIELDS,
				lazy: async () => ({ Component: (await import('./pages/content-detail-fields/content-detail-fields.page')).ContentDetailFieldsPage }),
			},
			{
				path: CONTENT_PATHS.DETAIL_TRANSLATIONS,
				lazy: async () => ({ Component: (await import('./pages/content-detail-translations/content-detail-translations.page')).ContentDetailTranslationsPage }),
			},
			{
				path: CONTENT_PATHS.DETAIL_COMPARTMENT,
				lazy: async () => ({ Component: (await import('./pages/content-detail-compartment/content-detail-compartment.page')).ContentDetailCompartmentPage }),
			},
			{
				path: CONTENT_PATHS.DETAIL_STATUS,
				lazy: async () => ({ Component: (await import('./pages/content-detail-status/content-detail-status.page')).ContentDetailStatusPage }),
			},
			{
				path: CONTENT_PATHS.DETAIL_REVISIONS,
				lazy: async () => ({ Component: (await import('./pages/content-detail-revisions/content-detail-revisions.page')).ContentDetailRevisionsPage }),
			},
			{
				path: CONTENT_PATHS.DETAIL_REVISION_PREVIEW,
				lazy: async () => ({ Component: (await import('./pages/content-detail-revision-detail/content-detail-revision-detail.page')).ContentDetailRevisionDetailPage }),
			},
			{
				path: CONTENT_PATHS.DETAIL_REVISION_COMPARE,
				lazy: async () => ({ Component: (await import('./pages/content-detail-revision-compare/content-detail-revision-compare.page')).ContentDetailRevisionComparePage }),
			},
			{
				path: CONTENT_PATHS.DETAIL_REVISION_CHANGES,
				lazy: async () => ({ Component: (await import('./pages/content-detail-revision-changes/content-detail-revision-changes.page')).ContentDetailRevisionChangesPage }),
			}
		]
	},
];
