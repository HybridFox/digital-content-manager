import { FC } from 'react';
import cx from 'classnames/bind';
import classNames from 'classnames';

import { ILoadingProps } from './loading.types';
import styles from './loading.module.scss';

const cxBind = cx.bind(styles);

export const Loading: FC<ILoadingProps> = ({
	className,
	text = 'Loading',
	children,
	loading = true,
}: ILoadingProps) => {
	if (!loading) {
		return children as any;
	}

	return (
		<div className={classNames(className, cxBind('a-loading'))}>
			{/* {title && <h3 className={cxBind('a-card__title')}>{title}</h3>}
			<div className={cxBind('a-card__content')}>
				{children}
			</div> */}
			<i className="las la-redo-alt la-spin"></i>
			<p className={cxBind('a-loading__text')}>{text}</p>
		</div>
	);
};
