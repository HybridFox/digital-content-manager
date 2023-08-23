import { FC } from 'react';
import cx from 'classnames/bind';
import { IField } from '@ibs/shared';

import { RenderFields } from '../../renderer';
import { FieldGroupHeader } from '../../components';

import { IFieldGroupFieldProps } from './field-group-field.types';
import styles from './field-group-field.module.scss';

const cxBind = cx.bind(styles);

export const FieldGroupField: FC<IFieldGroupFieldProps> = ({
	name,
	label,
	fieldConfiguration,
	siteId
}: IFieldGroupFieldProps) => {
	return (
		<div className={cxBind('o-field-group')}>
			<FieldGroupHeader label={label} multiLanguage={fieldConfiguration?.multiLanguage as boolean} badge='Group' />
			<div className={cxBind("o-field-group__fields")}>
				<RenderFields siteId={siteId || ''} fieldPrefix={`${name}.`} fields={fieldConfiguration?.fields as IField[] || []} />
			</div>
		</div>
	);
};
