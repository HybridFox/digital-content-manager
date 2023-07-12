import { FC } from 'react';
import cx from 'classnames/bind';
import styles from './Input.module.scss';
import { InputProps } from './Input.types';
const cxBind = cx.bind(styles);

export const Input: FC<InputProps> = ({
	placeholder,
	label,
	labelId,
	type,
}) => {
	return (
		<div className={cxBind('c-input')}>
			{label && (
				<label htmlFor={labelId} className={cxBind('c-input__label')}>
					{label}
				</label>
			)}

			<input
				id={labelId}
				className={cxBind('c-input__field')}
				placeholder={placeholder}
				type={type}
			/>
		</div>
	);
};
