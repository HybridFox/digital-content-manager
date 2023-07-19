import { FC } from 'react';
import cx from 'classnames/bind';

import styles from './button.module.scss';
import { IButtonProps } from './button.types';
import { HTMLButtonTypes, ButtonTypes } from './button.const';

const cxBind = cx.bind(styles);

export const Button: FC<IButtonProps> = ({
	children,
	htmlType = HTMLButtonTypes.BUTTON,
	type = ButtonTypes.PRIMARY,
	className,
	onClick,
}: IButtonProps) => {
	return (
		<button type={htmlType} onClick={onClick} className={cxBind('a-button', `a-button--${type}`, className)}>
			{children}
		</button>
	);
};
