import { FC } from 'react';
import cx from 'classnames/bind';

import { ITableCheckboxProps } from './table-checkbox.types';
import styles from './table-checkbox.module.scss';

const cxBind = cx.bind(styles);

export const TableCheckbox: FC<ITableCheckboxProps> = ({
	selected,
	onSelection
}: ITableCheckboxProps) => {
	return (
		<label className={cxBind('a-table-checkbox')}>
			<input type="checkbox" checked={selected} onChange={() => onSelection(!selected)} />
		</label>
	);
};
