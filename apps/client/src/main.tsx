import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';

import './assets/scss/main.scss';
import 'react-tooltip/dist/react-tooltip.css';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);
root.render(
	// <StrictMode>
		<App />
	// </StrictMode>
);
