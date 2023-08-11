import { FC } from 'react';
import cx from 'classnames/bind';
import ReactSelect from 'react-select';

import { ISelectProps, ISelectOptions } from './select.types';
import styles from './select.module.scss';

const cxBind = cx.bind(styles);

export const Select: FC<ISelectProps> = ({
	placeholder,
	options,
	value,
	onChange,
	className,
	closeMenuOnSelect,
	disabled,
	hasError
}: ISelectProps) => {
	const handleSelection = (key: any) => {
		if (onChange) {
			onChange(key.value);
		}

		if (key.onClick) {
			key.onClick();
		}
	}

	return (
		<ReactSelect
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
					'a-select__option--active': !!props.data.active,
				}),
			}}
			placeholder={placeholder}
			value={value}
			onChange={(e) => handleSelection(e)}
			options={options}
		/>
	);
};
