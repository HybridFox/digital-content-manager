import cx from 'classnames/bind'
import { useEffect } from 'react';
import { useContentComponentStore } from '@ibs/shared';
import { Header } from '@ibs/components';

import styles from './create.module.scss';
const cxBind = cx.bind(styles);

export const CreatePage = () => {
	const contentComponentStore = useContentComponentStore();

	useEffect(() => {
		contentComponentStore.fetchContentComponents({ pagesize: -1 });
	}, [])

	return (
		<div className={cxBind('p-content-type-create')}>
			<Header title='Create content type' subTitle='Content types'></Header>
		</div>
	)
}
