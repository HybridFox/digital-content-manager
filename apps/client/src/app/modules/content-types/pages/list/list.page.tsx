import cx from 'classnames/bind'
import { useEffect } from 'react';
import { useContentTypeStore } from '@ibs/shared';
import { ButtonLink } from '@ibs/components';

import styles from './list.module.scss';
const cxBind = cx.bind(styles);

export const ListPage = () => {
	const contentComponentStore = useContentTypeStore();

	useEffect(() => {
		contentComponentStore.fetchContentTypes();
	}, [])

	return (
		<div className={cxBind('p-dashboard')}>
			Content Types
			<ButtonLink to="create"><span className="las la-plus"></span> Create content type</ButtonLink>
		</div>
	)
}
