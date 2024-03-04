import { FC, ReactNode } from 'react';
import cx from 'classnames/bind';
import classNames from 'classnames';
import { compose, lensPath, path, set } from 'rambda';
import { arrayMove } from '@ibs/shared';

import { ITableColumn, ITableProps } from './table.types';
import styles from './table.module.scss';
import { TableCheckbox } from './components/table-checkbox/table-checkbox.component';
import { TableOrder } from './components/table-order/table-order.component';
import { ChangeGroupLocation } from './components/table-order/table-order.types';

const cxBind = cx.bind(styles);

export const Table: FC<ITableProps> = ({
	className,
	columns,
	rows,
	selectable,
	idKey = 'id',
	selectablePredicate,
	onSelection,
	selection = [],
	minSelection = 1,
	maxSelection = 1,
	orderable,
	onOrderChange,
	noDataText = 'No data',
	groups = [],
	rowGroupIdentifier = 'groupId',
}: ITableProps) => {
	const hasGroups = Array.isArray(groups) && !!groups.length;

	const handleSelection = (id: string, selected: boolean): void => {
		if (!onSelection) {
			return;
		}

		if (selected) {
			if (minSelection === 1 && maxSelection === 1) {
				return onSelection([id]);
			}

			const newSelection = [...selection, id];
			return onSelection(newSelection);
		}

		const newSelection = selection.filter((value) => value !== id);
		return onSelection(newSelection);
	};

	const renderCell = (i: number, row: Record<string, ReactNode>, column: ITableColumn): ReactNode => {
		if (column.component) {
			return column.component;
		}

		if (column.format && typeof column.format === 'function') {
			return column.format(path<ReactNode>(column.id.split('.'))(row), column.id, row, i);
		}

		return path<ReactNode>(column.id.split('.'))(row);
	};

	const isSelectable = (row: Record<any, any>): boolean => {
		if (minSelection === 1 && maxSelection === 1) {
			return true;
		}

		if (!selectable) {
			return false;
		}

		if (selectablePredicate ? !selectablePredicate(row) : false) {
			return false;
		}

		if (!selection.includes(row[idKey]) && selection.length >= maxSelection) {
			return false;
		}

		return true;
	};

	const handleOrderChange = (changingRow: Record<any, any>, newIndex: number): void => {
		if (!onOrderChange) {
			return console.warn('Please define "onOrderChange" on the Table element');
		}

		const groupRows = rows.filter((row) => row[rowGroupIdentifier] === changingRow[rowGroupIdentifier]);
		const groupLocation = groupRows.findIndex((row) => row[idKey] === changingRow[idKey]);
		const orderedGroupRows = arrayMove(groupRows, groupLocation, newIndex).map((row: any, i) => ({
			...row,
			sequenceNumber: i,
		}));
		const unmodifiedRows = rows.filter((row) => !orderedGroupRows.find((ogRow: any) => ogRow[idKey] === row[idKey]))

		onOrderChange([...orderedGroupRows, ...unmodifiedRows].sort((a: any, b: any) => a.sequenceNumber - b.sequenceNumber));
	};

	const handleGroupChange = (changingRow: Record<any, any>, newGroupId: string, location: ChangeGroupLocation): void => {
		if (!onOrderChange) {
			return console.warn('Please define "onOrderChange" on the Table element');
		}

		// const realLocation = rows.findIndex((row) => row[idKey] === changingRow[idKey]);
		const groupRows = rows.filter((row) => row[rowGroupIdentifier] === newGroupId);
		const newGroupRows = location === ChangeGroupLocation.START ? [{
			...changingRow,
			[rowGroupIdentifier]: newGroupId,
		}, ...groupRows] : [...groupRows, {
			...changingRow,
			[rowGroupIdentifier]: newGroupId,
		}];
		const orderedGroupRows = newGroupRows.map((row: any, i) => ({
			...row,
			sequenceNumber: i,
		}));
		const unmodifiedRows = rows.filter((row) => !orderedGroupRows.find((ogRow: any) => ogRow[idKey] === row[idKey]))

		onOrderChange([...orderedGroupRows, ...unmodifiedRows].sort((a: any, b: any) => a.sequenceNumber - b.sequenceNumber));
	};

	const renderGroups = () => {
		return groups.map((group, groupIndex) => {
			const groupedRows = rows.filter((row) => row[rowGroupIdentifier] ? row[rowGroupIdentifier] === group.id : groupIndex === 0);
			
			return (
				<>
					<tr
						key={group.id}
						className={cxBind('a-table__row', 'a-table__row--group')}
					>
						<td className={cxBind('a-table__row__cell', 'a-table__row__cell--group')} colSpan={columns.length + 2}>{group.name}</td>
					</tr>
					{groupedRows.map((row, rowIndex) => renderRow(row, rowIndex, groupedRows.length, group.id))}
				</>
			)
		});
	};

	const renderRows = () => {
		return rows.map((row, i) => renderRow(row, i, rows.length));
	};

	const renderRow = (row: Record<any, any>, i: number, totalRows: number, groupId?: string) => (
		<tr
			key={i}
			className={cxBind('a-table__row', {
				'a-table__row--selectable': selectable && (selectablePredicate ? selectablePredicate(row) : true),
			})}
			onClick={() => {
				if (!isSelectable(row)) {
					return;
				}

				handleSelection(row[idKey], !selection.includes(row[idKey]));
			}}
		>
			{hasGroups && (<td className={cxBind('a-table__row__cell')}></td>)}
			{orderable && (
				<td className={cxBind('a-table__row__cell')} style={{ width: '50px' }}>
					<TableOrder groups={groups} totalRows={totalRows} currentIndex={i} currentGroupId={groupId} row={row} onOrder={handleOrderChange} onChangeGroup={handleGroupChange} />
				</td>
			)}
			{selectable && (selectablePredicate ? selectablePredicate(row) : true) && (
				<td className={cxBind('a-table__row__cell')} style={{ width: '50px' }}>
					<TableCheckbox
						selected={selection.includes(row[idKey])}
						onSelection={(selected) => handleSelection(row[idKey], selected)}
						disabled={!isSelectable(row)}
					/>
				</td>
			)}
			{selectable && !(selectablePredicate ? selectablePredicate(row) : true) && (
				<td className={cxBind('a-table__row__cell')} style={{ width: '50px' }}></td>
			)}
			{columns.map((column, i) => (
				<td key={`${row[idKey]}-${i}`} className={cxBind('a-table__row__cell')} style={column.width ? { width: column.width } : {}}>
					{renderCell(i, row, column)}
				</td>
			))}
		</tr>
	);

	const renderNoData = () => {
		if (rows.length === 0) {
			return (
				<div className={cxBind('a-table__content')}>
					<div className={cxBind('a-table__no-data')}>{noDataText}</div>
				</div>
			);
		}

		return null;
	};

	return (
		<div className={classNames(className, cxBind('a-table'))}>
			<table className={cxBind('a-table__data')}>
				<thead className={cxBind('a-table__header')}>
					<tr>
						{hasGroups && <th style={{ width: '50px' }} className={cxBind('a-table__header__column')} />}
						{selectable && <th style={{ width: '50px' }} className={cxBind('a-table__header__column')} />}
						{orderable && <th style={{ width: '50px' }} className={cxBind('a-table__header__column')} />}
						{columns.map((column, i) => (
							<th key={i} className={cxBind('a-table__header__column')} style={column.width ? { width: column.width } : {}}>
								{column.label}
							</th>
						))}
					</tr>
				</thead>
				<tbody className={cxBind('a-table__content')}>{hasGroups ? renderGroups() : renderRows()}</tbody>
			</table>
			{renderNoData()}
		</div>
	);
};
