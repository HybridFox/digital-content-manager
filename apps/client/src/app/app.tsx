import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Root } from './modules/core/components/root/root.component';
import { AUTH_ROUTES } from './modules/auth';
import { AnonymousView } from './modules/core/views/anonymous/anonymous.view';
import { AuthenticatedView } from './modules/core/views/authenticated/authenticated.view';
import { DASHBOARD_ROUTES } from './modules/dashboard';
import { CONTENT_TYPES_ROUTES } from './modules/content-types';
import { CONTENT_ROUTES } from './modules/content';
import { CONTENT_COMPONENTS_ROUTES } from './modules/content-components';

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		children: [
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
