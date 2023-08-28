import { FC } from 'react';
import cx from 'classnames/bind';
import classNames from 'classnames';

import { ICardMeta, ICardProps } from './card.types';
import styles from './card.module.scss';
import { CardTypes } from './card.const';

const cxBind = cx.bind(styles);

export const Card: FC<ICardProps> = ({ children, type = CardTypes.PRIMARY, title, className }: ICardProps) => {
	return (
		<div className={classNames(className, cxBind('a-card', `a-card--${type}`))}>
			{title && <h3 className={cxBind('a-card__title')}>{title}</h3>}
			<div className={cxBind('a-card__content')}>{children}</div>
		</div>
	);
};

export const CardFooter: FC<ICardProps> = ({ children, className, type }: ICardProps) => {
	return <div className={classNames(className, cxBind('a-card__footer', `a-card__footer--${type}`))}>{children}</div>;
};

export const CardMeta: FC<ICardMeta> = ({ items }: ICardMeta) => {
	return (
		<div>
			{items.map((item, i) => (
				<div key={i} className={cxBind('a-card__meta')}>
					<div className={cxBind('a-card__meta__label')}>{item.label}</div>
					{item.value && <div className={cxBind('a-card__meta__value')}>{item.value}</div>}
				</div>
			))}
		</div>
	);
};
