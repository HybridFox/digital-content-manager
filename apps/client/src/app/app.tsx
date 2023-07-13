import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Root } from './modules/core/components/root/root.component';
import { AUTH_ROUTES } from './modules/auth';


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
	return (
		<RouterProvider router={router} />
	);
}

export default App;
