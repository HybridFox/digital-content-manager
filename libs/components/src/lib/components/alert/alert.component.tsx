import { FC, useEffect, useState } from 'react';
import cx from 'classnames/bind';
import classNames from 'classnames';

import { IAlertProps } from './alert.types';
import styles from './alert.module.scss';
import { AlertTypes } from './alert.const';

const cxBind = cx.bind(styles);

export const Alert: FC<IAlertProps> = ({
	children,
	type = AlertTypes.PRIMARY,
	className,
	closable = true,
}: IAlertProps) => {
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		setVisible(true);
	}, [children])

	if (!children || !visible) {
		return null;
	}

	return (
		<div className={classNames(className, cxBind('a-alert', `a-alert--${type}`))}>
			<div className={cxBind('a-alert__message')}>
				{children}
			</div>
			{closable && (
				<button className={cxBind('a-alert__close')} onClick={() => setVisible(false)}>
					<i className="las la-times"></i>
				</button>
			)}
		</div>
	);
};
