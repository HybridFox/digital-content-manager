import cx from 'classnames/bind';
import { FC } from 'react';

import styles from './avatar.module.scss';
const cxBind = cx.bind(styles);

interface IAvatarProps {
	src?: string;
	fallbackName: string;
}

export const Avatar: FC<IAvatarProps> = ({ src, fallbackName }: IAvatarProps) => {
	return (
		<div className={cxBind('o-avatar')}>
			{src && <img src={src} alt='User Avatar' />}
			{!src && <div className={cxBind('o-avatar__fallback')}>{fallbackName.substring(0, 2)}</div>}
		</div>
	);
};
