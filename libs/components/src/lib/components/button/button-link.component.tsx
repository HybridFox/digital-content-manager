import { FC } from 'react';
import cx from 'classnames/bind';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import styles from './button.module.scss';
import { ButtonSizes, ButtonTypes } from './button.const';
import { IButtonLinkProps } from './button-link.types';

const cxBind = cx.bind(styles);

export const ButtonLink: FC<IButtonLinkProps> = ({
	children,
	className,
	type = ButtonTypes.DEFAULT,
	size = ButtonSizes.NORMAL,
	to,
	block,
	disabled,
	active,
	id,
}: IButtonLinkProps) => {
	return (
		<Link
			to={to}
			className={classNames(
				className,
				cxBind('a-button', `a-button--${type}`, `a-button--${size}`, {
					'a-button--block': block,
					'a-button--active': active,
					'a-button--disabled': disabled,
				})
			)}
		>
			{children}
		</Link>
	);
};
