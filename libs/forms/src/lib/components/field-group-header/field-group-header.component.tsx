import { FC } from 'react';
import cx from 'classnames/bind';
import { Badge, BadgeSizes } from '@ibs/components';

import { FIELD_VIEW_MODE } from '../../fields';

import { IFieldGroupHeaderProps } from './field-group-header.types';
import styles from './field-group-header.module.scss';

const cxBind = cx.bind(styles);

export const FieldGroupHeader: FC<IFieldGroupHeaderProps> = ({
	label,
	multiLanguage,
	badge,
	viewMode = FIELD_VIEW_MODE.EDIT,
}: IFieldGroupHeaderProps) => {
	const renderIcon = () => {
		if (viewMode !== FIELD_VIEW_MODE.EDIT) {
			return;
		}

		if (multiLanguage === undefined) {
			return null;
		}

		if (multiLanguage) {
			return <span className="las la-globe" />
		}

		return <span className="las la-exchange-alt" />
	}

	return (
		<h6 className={cxBind('o-field-group-header')}>
			<span className={cxBind('o-field-group-header__title')}>{badge && <Badge size={BadgeSizes.SMALL} className='u-margin-right-xs'>{badge}</Badge>}<span>{label}</span></span>
			{renderIcon()}
		</h6>
	);
};
