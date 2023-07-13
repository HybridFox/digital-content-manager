import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';

import { Root } from './modules/core/components/root/root.component';
import { AUTH_ROUTES } from './modules/auth';
import { useAuthStore } from './modules/core/stores/auth.store';


const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		children: [
			{
				path: 'auth',
				children: AUTH_ROUTES
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
