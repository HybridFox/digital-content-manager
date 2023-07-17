import cx from 'classnames/bind'

import styles from './dashboard.module.scss';
const cxBind = cx.bind(styles);

export const DashboardPage = () => {
	return (
		<div className={cxBind('p-dashboard')}>
			Dashboard
		</div>
	)
}
