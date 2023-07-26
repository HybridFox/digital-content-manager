import { FC } from 'react';
import cx from 'classnames/bind';
import classNames from 'classnames';

import styles from './button.module.scss';
import { IButtonProps } from './button.types';
import { HTMLButtonTypes, ButtonTypes, ButtonSizes } from './button.const';

const cxBind = cx.bind(styles);

export const Button: FC<IButtonProps> = ({
	children,
	htmlType = HTMLButtonTypes.BUTTON,
	type = ButtonTypes.PRIMARY,
	size = ButtonSizes.NORMAL,
	block,
	className,
	onClick,
	disabled,
}: IButtonProps) => {
	return (
		<button
			disabled={disabled}
			type={htmlType}
			onClick={onClick}
			className={classNames(
				className,
				cxBind('a-button', `a-button--${type}`, `a-button--${size}`, {
					'a-button--block': block,
				})
			)}
		>
			{children}
		</button>
	);
};
