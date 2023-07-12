'use client';

import cx from 'classnames/bind';
import { FC } from 'react';
import { ButtonProps } from './Button.types';
import styles from './Button.module.scss';
const cxBind = cx.bind(styles);

export const Button: FC<ButtonProps> = ({
	children,
	onClick,
	icon,
	iconPosition,
	classNames,
}) => {
	return (
		<button
			onClick={onClick}
			className={cxBind(
				'c-button',
				{
					'c-button--icon-left': icon && iconPosition === 'left',
					'c-button--icon-right': icon && iconPosition === 'right',
				},
				classNames,
			)}
		>
			{icon}
			{children}
		</button>
	);
};
