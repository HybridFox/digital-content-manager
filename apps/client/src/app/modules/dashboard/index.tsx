import { RouteObject } from "react-router-dom";

import { DashboardPage } from "./pages/dashboard/dashboard.page";

export const DASHBOARD_ROUTES: RouteObject[] = [
	{
		path: 'dashboard',
		element: <DashboardPage />
	}
]
