import { FC } from 'react';
import cx from 'classnames/bind';
import classNames from 'classnames';

import { IBadgeProps } from './badge.types';
import styles from './badge.module.scss';
import { BadgeSizes, BadgeTypes } from './badge.const';

const cxBind = cx.bind(styles);

export const Badge: FC<IBadgeProps> = ({
	children,
	type = BadgeTypes.PRIMARY,
	size = BadgeSizes.DEFAULT,
	className,
}: IBadgeProps) => {
	return (
		<span className={classNames(className, cxBind('a-badge', `a-badge--${type}`, `a-badge--${size}`))}>
			{children}
		</span>
	);
};
