import { RouteObject } from "react-router-dom";

import { LoginPage } from "./pages/login/login.page";
import { CallbackPage } from "./pages/callback/callback.page";

export const AUTH_ROUTES: RouteObject[] = [
	{
		path: 'login',
		element: <LoginPage />
	},
	{
		path: ':authenticationMethodId/callback',
		element: <CallbackPage />
	}
]
