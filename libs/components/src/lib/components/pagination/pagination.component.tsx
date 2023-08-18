import { FC } from 'react';
import cx from 'classnames/bind';
import ReactPaginate from 'react-paginate';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { Select } from '../select';

import styles from './pagination.module.scss';
import { IPaginationProps } from './pagination.types';
import { PAGINATION_PAGE_SIZE_OPTIONS } from './pagination.const';

const cxBind = cx.bind(styles);

export const Pagination: FC<IPaginationProps> = ({ totalPages = 1, className, onPageChange, onPagesizeChange, number, size }: IPaginationProps) => {
	const { t } = useTranslation();

	return (
		<div className={classNames(cxBind('m-pagination'), className)}>
			<div className={cxBind('m-pagination__pagination')}>
				<ReactPaginate
					forcePage={(number || 1) - 1}
					breakLabel="..."
					nextLabel={
						<>
							{t('GENERAL.PAGINATION.NEXT')} <span className="las la-angle-right" />
						</>
					}
					previousClassName={cxBind('m-pagination__nav', 'm-pagination__nav--previous')}
					nextClassName={cxBind('m-pagination__nav', 'm-pagination__nav--next')}
					pageClassName={cxBind('m-pagination__page')}
					activeClassName={cxBind('m-pagination__page--active')}
					disabledClassName={cxBind('m-pagination__page--disabled')}
					breakClassName={cxBind('m-pagination__break')}
					onPageChange={({ selected }) => onPageChange(selected + 1)}
					pageCount={totalPages}
					previousLabel={
						<>
							<span className="las la-angle-left" /> {t('GENERAL.PAGINATION.PREVIOUS')}
						</>
					}
					renderOnZeroPageCount={null}
				/>
			</div>
			{!!onPagesizeChange && (
				<div className={cxBind('m-pagination__pagesize')}>
					<p className={cxBind('m-pagination__pagesize__label')}>{t('GENERAL.PAGINATION.PAGESIZE')}:</p>
					<Select
						options={PAGINATION_PAGE_SIZE_OPTIONS}
						isClearable={false}
						className={cxBind('m-pagination__pagesize__select')}
						onChange={(value) => onPagesizeChange(Number(value))}
						value={{ label: size, value: size }}
					/>
				</div>
			)}
		</div>
	);
};
