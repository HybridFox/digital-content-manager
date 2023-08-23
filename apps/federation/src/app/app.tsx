// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Route, Routes, Link } from 'react-router-dom';
import { useEffect } from 'react';

import styles from './app.module.scss';
import NxWelcome from './nx-welcome';


export function App() {
	useEffect(() => {
		const element = document.createElement("script");

		element.src = "http://127.0.0.1:8080/remoteEntry.js";
		element.type = "text/javascript";
		element.async = true;
		element.type = "module"

		// setReady(false);
		// setFailed(false);

		element.onload = () => {
			console.log(`Dynamic Script Loaded: http://127.0.0.1:8080/remoteEntry.js`);


			(async () => {
				// @ts-expect-error aaa
				await __webpack_init_sharing__('default');
				// @ts-expect-error aaa
				console.log(window['remote-app'])
				// const 
			})();
		// setReady(true);
		};

		element.onerror = () => {
			console.error(`Dynamic Script Error: http://127.0.0.1:8080/remoteEntry.js`);
		// setReady(false);
		// setFailed(true);
		};

		document.head.appendChild(element);
		

		return () => {
		  console.log(`Dynamic Script Removed: http://127.0.0.1:8080/remoteEntry.js`);
		  document.head.removeChild(element);
		};
	}, [])

	return (
		<div>
			<NxWelcome title="federation" />

			{/* START: routes */}
			{/* These routes and navigation have been generated for you */}
			{/* Feel free to move and update them to fit your needs */}
			<br />
			<hr />
			<br />
			<div role="navigation">
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/page-2">Page 2</Link>
					</li>
				</ul>
			</div>
			<Routes>
				<Route
					path="/"
					element={
						<div>
							This is the generated root route. <Link to="/page-2">Click here for page 2.</Link>
						</div>
					}
				/>
				<Route
					path="/page-2"
					element={
						<div>
							<Link to="/">Click here to go back to root page.</Link>
						</div>
					}
				/>
			</Routes>
			{/* END: routes */}
		</div>
	);
}

export default App;
