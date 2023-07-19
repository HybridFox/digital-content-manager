import { FC } from 'react';
import cx from 'classnames/bind';

import { IHeaderProps } from './header.types';
import styles from './header.module.scss';

const cxBind = cx.bind(styles);

export const Header: FC<IHeaderProps> = ({
	title,
	subTitle,
	action
}: IHeaderProps) => {
	return (
		<div className={cxBind('m-header')}>
			<div className={cxBind('m-header__content')}>
				{subTitle && <p className={cxBind('m-header__sub-title')}>{subTitle}</p>}
				<h1 className={cxBind('m-header__title')}>{title}</h1>
			</div>
			{action && (
				<div className={cxBind('m-header__action')}>
					{action}
				</div>
			)}
		</div>
	);
};
