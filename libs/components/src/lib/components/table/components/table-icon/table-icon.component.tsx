import { FC } from 'react';
import cx from 'classnames/bind';

import { ITableIconProps } from './table-icon.types';
import styles from './table-icon.module.scss';

const cxBind = cx.bind(styles);

export const TableIcon: FC<ITableIconProps> = ({
	icon
}: ITableIconProps) => {
	return (
		<div className={cxBind('a-table-icon')}>
			<span className={icon}></span>
		</div>
	);
};
