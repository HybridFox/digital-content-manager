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
			return column.format(row[column.id], column.id, row, i);
		}

		return path<ReactNode>(column.id.split('.'))(row);
	};

	const renderRows = () => {
		return rows.map((row) => (
			<div key={row.id} className={cxBind('a-table__row')}>
				{columns.map((column, i) => (
					<div
						key={`${row.id}-${column.id}`}
						className={cxBind('a-table__row__cell')}
					>
						{renderCell(i, row, column)}
					</div>
				))}
			</div>
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
			<div className={cxBind('a-table__data')}>
				<div className={cxBind('a-table__header')}>
					{columns.map((column) => (
						<div
							key={column.id}
							className={cxBind('a-table__header__column')}
						>
							{column.label}
						</div>
					))}
				</div>
				<div className={cxBind('a-table__content')}>{renderRows()}</div>
			</div>
			{renderNoData()}
		</div>
	);
};
