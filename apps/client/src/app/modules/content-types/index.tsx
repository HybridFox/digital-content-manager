import { RouteObject } from "react-router-dom";

import { CTListPage } from "./pages/ct-list/ct-list.page";
import { CTCreatePage } from "./pages/ct-create/ct-create.page";
import { CTDetailPage } from "./pages/ct-detail/ct-detail.page";
import { FieldDetailPage } from "./pages/field-detail/field-detail.page";

export const CONTENT_TYPES_ROUTES: RouteObject[] = [
	{
		path: 'content-types',
		element: <CTListPage />
	},
	{
		path: 'content-types/create',
		element: <CTCreatePage />
	},
	{
		path: 'content-types/:contentTypeId',
		children: [
			{
				path: '',
				element: <CTDetailPage />
			},
			{
				path: 'fields/:fieldId',
				element: <FieldDetailPage />
			}
		]
	}
]
