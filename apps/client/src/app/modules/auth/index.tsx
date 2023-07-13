import { RouteObject } from "react-router-dom";

import { LoginPage } from "./pages/login/login.page";

export const AUTH_ROUTES: RouteObject[] = [
	{
		path: 'login',
		element: <LoginPage />
	}
]
