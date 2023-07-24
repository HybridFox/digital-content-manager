import { FC } from 'react';
import cx from 'classnames/bind';
import classNames from 'classnames';

import { ICardProps } from './card.types';
import styles from './card.module.scss';
import { CardTypes } from './card.const';

const cxBind = cx.bind(styles);

export const Card: FC<ICardProps> = ({
	children,
	type = CardTypes.PRIMARY,
	title,
	className,
}: ICardProps) => {
	return (
		<div className={classNames(className, cxBind('a-card', `a-card--${type}`))}>
			{title && <h3 className={cxBind('a-card__title')}>{title}</h3>}
			<div className={cxBind('a-card__content')}>
				{children}
			</div>
		</div>
	);
};
