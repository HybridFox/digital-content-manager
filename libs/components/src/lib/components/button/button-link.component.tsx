import { FC } from 'react';
import cx from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './button.module.scss';
import { ButtonTypes } from './button.const';
import { IButtonLinkProps } from './button-link.types';

const cxBind = cx.bind(styles);

export const ButtonLink: FC<IButtonLinkProps> = ({
	children,
	className,
	type = ButtonTypes.PRIMARY,
	to,
}: IButtonLinkProps) => {
	return (
		<Link to={to} className={cxBind('a-button', `a-button--${type}`, className)}>
			{children}
		</Link>
	);
};
