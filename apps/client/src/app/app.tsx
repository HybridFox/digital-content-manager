import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { Root } from './modules/core/components/root/root.component';
import { AUTH_ROUTES } from './modules/auth';
import { AnonymousView } from './modules/core/views/anonymous/anonymous.view';
import { AuthenticatedView } from './modules/core/views/authenticated/authenticated.view';
import { DASHBOARD_ROUTES } from './modules/dashboard';
import { CONTENT_TYPES_ROUTES } from './modules/content-types';
import { CONTENT_ROUTES } from './modules/content';
import { CONTENT_COMPONENTS_ROUTES } from './modules/content-components';
import { RESOURCE_ROUTES } from './modules/resources';
import { STORAGE_ROUTES } from './modules/storage';
import { WORKFLOW_ROUTES } from './modules/workflow';
import { USERS_ROUTES } from './modules/users';
import { ROLES_ROUTES } from './modules/roles';
import { POLICIES_ROUTES } from './modules/policies';
import { AUTHENTICATION_METHODS_ROUTES } from './modules/authentication-methods';

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
			{
				path: 'app',
				element: <AuthenticatedView />,
				children: [
					...DASHBOARD_ROUTES,
					...CONTENT_TYPES_ROUTES,
					...CONTENT_ROUTES,
					...CONTENT_COMPONENTS_ROUTES,
					...RESOURCE_ROUTES,
					...STORAGE_ROUTES,
					...WORKFLOW_ROUTES,
					...USERS_ROUTES,
					...ROLES_ROUTES,
					...POLICIES_ROUTES,
					...AUTHENTICATION_METHODS_ROUTES
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
