import { FC } from 'react';
import cx from 'classnames/bind';

import { Button, ButtonSizes, ButtonTypes } from '../../../button';

import { ITableOrderProps } from './table-order.types';
import styles from './table-order.module.scss';

const cxBind = cx.bind(styles);

export const TableOrder: FC<ITableOrderProps> = ({
	onOrder,
	currentIndex,
	totalRows,
}: ITableOrderProps) => {
	return (
		<div className={cxBind('a-table-order')}>
			<Button
				disabled={currentIndex === 0}
				size={ButtonSizes.EXTRA_SMALL}
				type={ButtonTypes.OUTLINE}
				onClick={() => onOrder(currentIndex, currentIndex - 1)}
			>
				<i className="las la-angle-up"></i>
			</Button>
			<Button
				disabled={currentIndex === totalRows - 1}
				size={ButtonSizes.EXTRA_SMALL}
				type={ButtonTypes.OUTLINE}
				onClick={() => onOrder(currentIndex, currentIndex + 1)}
			>
				<i className="las la-angle-down"></i>
			</Button>
		</div>
	);
};
