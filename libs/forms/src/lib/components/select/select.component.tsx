import { FC, lazy } from 'react';
import cx from 'classnames/bind';

import { ISelectProps } from './select.types';
import styles from './select.module.scss';
const ReactSelect = lazy(() => import('react-select'));

const cxBind = cx.bind(styles);

export const Select: FC<ISelectProps> = ({
	placeholder,
	options,
	value,
	onChange,
	className,
	closeMenuOnSelect,
	disabled,
	hasError,
	min,
	max,
}: ISelectProps) => {
	const isMulti = min !== 1 || max !== 1;
	const handleSelection = (key: any) => {
		if (Array.isArray(key) && onChange) {
			onChange(key.map(({ value }: { value: string }) => value));
		} else if (!Array.isArray(key) && onChange) {
			onChange(key.value);
		}

		if (key.onClick) {
			key.onClick();
		}
	}

	return (
		<ReactSelect
			isMulti={isMulti}
			closeMenuOnSelect={closeMenuOnSelect}
			isDisabled={disabled}
			className={className}
			unstyled={true}
			classNames={{
				control: () => cxBind('a-select', {
					'a-select--has-error': hasError
				}),
				valueContainer: () => cxBind('a-select__value-container'),
				menu: () => cxBind('a-select__menu'),
				menuList: () => cxBind('a-select__menu-list'),
				option: (props) => cxBind('a-select__option', {
					'a-select__option--active': !!(props.data as Record<string, string>).active || props.isSelected,
					'a-select__option--focus': props.isFocused,
				}),
				placeholder: () => cxBind('a-select__placeholder'),
				group: () => cxBind('a-select__group'),
				groupHeading: () => cxBind('a-select__group__heading'),
				multiValue: () => cxBind('a-select__multi-value'),
				multiValueLabel: () => cxBind('a-select__multi-value__label'),
				multiValueRemove: () => cxBind('a-select__multi-value__remove'),
			}}
			placeholder={placeholder}
			value={value}
			onChange={(e) => handleSelection(e)}
			options={options}
		/>
	);
};
