import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { Root } from './modules/core/components/root/root.component';
import { AUTH_ROUTES } from './modules/auth';
import { AnonymousView } from './modules/core/views/anonymous/anonymous.view';
import { AuthenticatedView } from './modules/core/views/authenticated/authenticated.view';
import { DASHBOARD_ROUTES } from './modules/dashboard';
import { CONTENT_TYPE_ROUTES } from './modules/content-types';
import { CONTENT_ROUTES } from './modules/content';
import { CONTENT_COMPONENT_ROUTES } from './modules/content-components';
import { RESOURCE_ROUTES } from './modules/resources';
import { STORAGE_ROUTES } from './modules/storage';
import { WORKFLOW_ROUTES } from './modules/workflow';
import { USER_ROUTES } from './modules/users';
import { ROLE_ROUTES } from './modules/roles';
import { POLICY_ROUTES } from './modules/policies';
import { AUTHENTICATION_METHOD_ROUTES } from './modules/authentication-methods';
import { SETUP_ROUTES } from './modules/setup/setup.routes';
import { SITE_ROUTES } from './modules/sites';

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		children: [
			{
				path: '/',
				element: <Navigate to="/app/dashboard" />
			},
			{
				path: 'auth',
				element: <AnonymousView />,
				children: AUTH_ROUTES
			},
			...SETUP_ROUTES,
			{
				path: 'app',
				element: <AuthenticatedView />,
				children: [
					...SITE_ROUTES,
					...DASHBOARD_ROUTES,
					...CONTENT_TYPE_ROUTES,
					...CONTENT_ROUTES,
					...CONTENT_COMPONENT_ROUTES,
					...RESOURCE_ROUTES,
					...STORAGE_ROUTES,
					...WORKFLOW_ROUTES,
					...USER_ROUTES,
					...ROLE_ROUTES,
					...POLICY_ROUTES,
					...AUTHENTICATION_METHOD_ROUTES
				]
			}
		]
	}
])

export const App = () => {
	return (
		<RouterProvider router={router} />
	);
}

export default App;
