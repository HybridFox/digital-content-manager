import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import i18n from 'i18next';
import { useTranslation, initReactI18next } from 'react-i18next';
import Modal from 'react-modal';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import App from './app/app';

import './assets/scss/main.scss';
import 'react-tooltip/dist/react-tooltip.css';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

Modal.setAppElement('#root');

// ISO 639-1 + '_' + ISO 3166-1
// https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes

i18n.use(initReactI18next).init({
	resources: {
		en_GB: {
			translation: {
				BREADCRUMBS: {
					CONTENT: 'Content',
					PAGES: 'Pages',
					'CONTENT-BLOCKS': 'Content Blocks',
				},
				PAGES: {
					TITLES: {
						ALL_CONTENT: 'All content',
						ALL_PAGES: 'All pages',
						'ALL_CONTENT-BLOCKS': 'All content blocks',
					},
					ACTIONS: {
						CREATE_CONTENT: 'Create content',
						CREATE_PAGES: 'Create page',
						'CREATE_CONTENT-BLOCKS': 'Create content blocks',
					},
				},
			},
		},
	},
	lng: 'en_GB',
	fallbackLng: 'en_GB',
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	// <StrictMode>
	<App />
	// </StrictMode>
);
