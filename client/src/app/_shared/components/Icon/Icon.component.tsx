import { FC } from 'react';
import cx from 'classnames/bind';

import { IconProps } from './Icon.types';

import styles from './Icon.module.scss';
import classNames from 'classnames';

export const Icon: FC<IconProps> = ({ icon, variant = 'lar' }) => {
	const cxBind = cx.bind(styles);

	return <i className={classNames(cxBind('a-icon'), `${variant} la-${icon}`)}></i>;
};
