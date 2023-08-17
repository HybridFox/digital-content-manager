import { FC } from 'react';
import cx from 'classnames/bind';

import { ITabsProps } from './tabs.types';
import styles from './tabs.module.scss';

const cxBind = cx.bind(styles);

export const Tabs: FC<ITabsProps> = ({ tabs = [], selectedTabId }: ITabsProps) => {
	return (
		<div className={cxBind('m-tabs')}>
			{tabs.map((tab) => (
				<button
					key={tab.id}
					className={cxBind('m-tabs__link', {
						'm-tabs__link--active': selectedTabId === tab.id,
					})}
					onClick={() => tab.onClick(tab.id)}
				>
					{tab.label}
				</button>
			))}
		</div>
	);
};
