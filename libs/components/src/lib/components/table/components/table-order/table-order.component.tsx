import { FC, useMemo } from 'react';
import cx from 'classnames/bind';

import { Button, ButtonSizes, ButtonTypes } from '../../../button';

import { ChangeGroupLocation, ITableOrderProps } from './table-order.types';
import styles from './table-order.module.scss';

const cxBind = cx.bind(styles);

export const TableOrder: FC<ITableOrderProps> = ({
	onOrder,
	onChangeGroup,
	currentIndex,
	totalRows,
	groups,
	row,
	currentGroupId,
}: ITableOrderProps) => {
	const previousDisabled = useMemo(() => {
		if (!groups || !groups.length) {
			return currentIndex === 0;
		}

		// Is the current index 0 and is there a previous group? Then yes, the button should be disabled
		return currentIndex === 0 && groups.findIndex((group) => group.id === currentGroupId) === 0;
	}, [currentIndex, groups, currentGroupId]);
	
	const nextDisabled = useMemo(() => {
		if (!groups || !groups.length) {
			return currentIndex === totalRows - 1;
		}

		// Is the current index the last one and is there no next group? Then yes, the button should be disabled
		return currentIndex === totalRows - 1 && groups.findIndex((group) => group.id === currentGroupId) === groups.length - 1;
	}, [currentIndex, groups, currentGroupId, totalRows]);

	const handleOrder = (currentIndex: number, newIndex: number): void => {
		if (newIndex === -1 && groups) {
			// We want to go to the previous group
			const currentGroupIndex = groups.findIndex((group) => group.id === currentGroupId);
			return onChangeGroup(row, groups[currentGroupIndex - 1].id, ChangeGroupLocation.END)
		}

		if (newIndex > (totalRows - 1) && groups) {
			// We want to go to the next group
			const currentGroupIndex = groups.findIndex((group) => group.id === currentGroupId);
			return onChangeGroup(row, groups[currentGroupIndex + 1].id, ChangeGroupLocation.START)
		}

		onOrder(row, newIndex);
	}

	return (
		<div className={cxBind('a-table-order')}>
			<Button
				disabled={previousDisabled}
				size={ButtonSizes.EXTRA_SMALL}
				type={ButtonTypes.OUTLINE}
				onClick={() => handleOrder(currentIndex, currentIndex - 1)}
			>
				<i className="las la-angle-up"></i>
			</Button>
			<Button
				disabled={nextDisabled}
				size={ButtonSizes.EXTRA_SMALL}
				type={ButtonTypes.OUTLINE}
				onClick={() => handleOrder(currentIndex, currentIndex + 1)}
			>
				<i className="las la-angle-down"></i>
			</Button>
		</div>
	);
};
