import { FC } from 'react';
import cx from 'classnames/bind';

import { Badge, BadgeSizes } from '~components';

import { FieldViewMode } from '../../fields';
import { FieldError } from '../../field-error/field-error.component';

import { IFieldGroupHeaderProps } from './field-group-header.types';
import styles from './field-group-header.module.scss';

const cxBind = cx.bind(styles);

export const FieldGroupHeader: FC<IFieldGroupHeaderProps> = ({
	label,
	multiLanguage,
	badge,
	viewMode = FieldViewMode.EDIT,
	name,
}: IFieldGroupHeaderProps) => {
	const renderIcon = () => {
		if (viewMode !== FieldViewMode.EDIT) {
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
			<span className={cxBind('o-field-group-header__title')}>
				{badge && <Badge size={BadgeSizes.SMALL} className='u-margin-right-xs'>{badge}</Badge>}
				<span>{label}</span>
				{name && <FieldError name={name} />}
			</span>
			{renderIcon()}
		</h6>
	);
};
