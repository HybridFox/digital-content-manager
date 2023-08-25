import { FC } from 'react';
import cx from 'classnames/bind';

import { ITableCheckboxProps } from './table-checkbox.types';
import styles from './table-checkbox.module.scss';

const cxBind = cx.bind(styles);

export const TableCheckbox: FC<ITableCheckboxProps> = ({ selected, onSelection, disabled = false }: ITableCheckboxProps) => {
	return (
		<label className={cxBind('a-table-checkbox')}>
			<input
				type="checkbox"
				checked={selected}
				disabled={disabled}
				onChange={() => {
					if (disabled) {
						return;
					}
					
					onSelection(!selected);
				}}
			/>
		</label>
	);
};
