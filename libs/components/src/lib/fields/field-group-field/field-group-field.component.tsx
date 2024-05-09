import { FC } from 'react';
import cx from 'classnames/bind';

import { FieldGroupHeader } from '../../components';
import { RenderFields } from '../../renderer';

import { IFieldGroupFieldProps } from './field-group-field.types';
import styles from './field-group-field.module.scss';

import { IField } from '~shared';

const cxBind = cx.bind(styles);

export const FieldGroupField: FC<IFieldGroupFieldProps> = ({
	name,
	label,
	fieldConfiguration,
	siteId,
	viewMode
}: IFieldGroupFieldProps) => {
	return (
		<div className={cxBind('o-field-group')}>
			<FieldGroupHeader viewMode={viewMode} label={label} multiLanguage={fieldConfiguration?.multiLanguage as boolean} badge='Group' />
			<div className={cxBind("o-field-group__fields")}>
				<RenderFields siteId={siteId || ''} fieldPrefix={`${name}.`} fields={fieldConfiguration?.fields as IField[] || []} viewMode={viewMode} />
			</div>
		</div>
	);
};
