import {FC, useCallback, useEffect, useMemo, useState} from 'react';
import cx from 'classnames/bind';
import classNames from 'classnames';
import {pick} from "rambda";
import {FormProvider, useForm} from "react-hook-form";
import debounce from "lodash.debounce";

import {RenderFields} from "../../renderer";



import { IFiltersProps } from './filter.types';
import styles from './filter.module.scss';

import {IField} from "~shared";


const cxBind = cx.bind(styles);

export const Filter: FC<IFiltersProps> = ({ className, onFiltering, filtering, filters, siteId }: IFiltersProps) => {
	// console.log(filtering)
	const filterFormMethods = useForm({
		defaultValues: filtering
	});
	const [filtersOpen, setFiltersOpen] = useState(false);

	const debouncedFilter = useCallback(debounce(onFiltering, 500), [])

	const fields: IField[] = useMemo(() => {
		return (filters || []).map((filter) => ({
			...pick(['name', 'slug', 'config'])(filter),
			min: 1,
			max: 1,
			contentComponent: {
				componentName: filter.contentComponent,
				configurationFields: [],
				fields: []
			}
		}))
	}, []);

	const { watch } = filterFormMethods;
	useEffect(() => {
		const subscription = watch((values) => debouncedFilter(values))
		return () => subscription.unsubscribe()
	}, [watch]);

	useEffect(() => {
		if (Object.keys(filtering).length) {
			setFiltersOpen(true);
		}
	}, [])

	return (
		<div className={classNames(cxBind('m-filter'), className)}>
			<button className={classNames(cxBind('m-filter__header'))} onClick={() => setFiltersOpen((open) => !open)}>
				<span className={cxBind('m-filter__header__title')}>
					<span className={classNames('las', {
						'la-angle-down': !filtersOpen,
						'la-angle-up': filtersOpen,
					})}></span> Filters
				</span>
				{/*{!!Object.keys(filtering).length && (*/}
				{/*	<span className={cxBind('m-filter__header__filters')}>*/}
				{/*	{Object.keys(filtering).map((filterKey) => (*/}
				{/*		<span>{filterKey}: {filtering[filterKey]}</span>*/}
				{/*	))}*/}
				{/*</span>*/}
				{/*)}*/}
			</button>
			{filtersOpen && <div className={classNames(cxBind('m-filter__filters'))}>
				<FormProvider {...filterFormMethods}>
					<form>
						<div className="u-row">
							<RenderFields fields={fields} siteId={siteId} />
						</div>
					</form>
				</FormProvider>
			</div>}
		</div>
	);
};
