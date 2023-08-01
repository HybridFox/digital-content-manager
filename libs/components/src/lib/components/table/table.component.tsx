import { FC, ReactNode } from 'react';
import cx from 'classnames/bind';
import classNames from 'classnames';
import { path } from 'rambda';

import { ITableColumn, ITableProps } from './table.types';
import styles from './table.module.scss';

const cxBind = cx.bind(styles);

export const Table: FC<ITableProps> = ({
	className,
	columns,
	rows,
}: ITableProps) => {
	const renderCell = (
		i: number,
		row: Record<string, ReactNode>,
		column: ITableColumn
	): ReactNode => {
		if (column.component) {
			return column.component;
		}

		if (column.format && typeof column.format === 'function') {
			return column.format(path<ReactNode>(column.id.split('.'))(row), column.id, row, i);
		}

		return path<ReactNode>(column.id.split('.'))(row);
	};

	const renderRows = () => {
		return rows.map((row, i) => (
			<tr key={i} className={cxBind('a-table__row')}>
				{columns.map((column, i) => (
					<td
						key={`${row.id}-${i}`}
						className={cxBind('a-table__row__cell')}
						style={column.width ? { width: column.width } : {}}
					>
						{renderCell(i, row, column)}
					</td>
				))}
			</tr>
		));
	};

	const renderNoData = () => {
		if (rows.length === 0) {
			return (
				<div className={cxBind('a-table__content')}>
					<div className={cxBind('a-table__no-data')}>No data</div>
				</div>
			);
		}

		return null;
	}

	return (
		<div className={classNames(className, cxBind('a-table'))}>
			<table className={cxBind('a-table__data')}>
				<thead className={cxBind('a-table__header')}>
					<tr>
						{columns.map((column, i) => (
							<th
								key={i}
								className={cxBind('a-table__header__column')}
								style={column.width ? { width: column.width } : {}}
							>
								{column.label}
							</th>
						))}
					</tr>
				</thead>
				<tbody className={cxBind('a-table__content')}>{renderRows()}</tbody>
			</table>
			{renderNoData()}
		</div>
	);
};
