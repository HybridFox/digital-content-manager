import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';

import { Root } from './modules/core/components/root/root.component';
import { AUTH_ROUTES } from './modules/auth';
import { useAuthStore } from './modules/core/stores/auth.store';
import { AnonymousView } from './modules/core/views/anonymous/anonymous.view';
import { AuthenticatedView } from './modules/core/views/authenticated/authenticated.view';
import { DASHBOARD_ROUTES } from './modules/dashboard';


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
					...DASHBOARD_ROUTES
				]
			}
		]
	}
])

export const App = () => {
	const authStore = useAuthStore();

	useEffect(() => {
		authStore.fetchUser();
	}, [])

	return (
		<RouterProvider router={router} />
	);
}

export default App;
