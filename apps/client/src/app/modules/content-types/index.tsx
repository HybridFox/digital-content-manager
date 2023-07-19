import { RouteObject } from "react-router-dom";

import { ListPage } from "./pages/list/list.page";
import { CreatePage } from "./pages/create/create.page";

export const CONTENT_TYPES_ROUTES: RouteObject[] = [
	{
		path: 'content-types',
		element: <ListPage />
	},
	{
		path: 'content-types/create',
		element: <CreatePage />
	}
]
