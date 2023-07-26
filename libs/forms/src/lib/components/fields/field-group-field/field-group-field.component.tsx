import { FC } from 'react';
import cx from 'classnames/bind';
import { IField } from '@ibs/shared';

import { RenderFields } from '../../renderer';

import { IFieldGroupFieldProps } from './field-group-field.types';
import styles from './field-group-field.module.scss';

const cxBind = cx.bind(styles);

export const FieldGroupField: FC<IFieldGroupFieldProps> = ({
	name,
	label,
	fieldConfiguration,
	fieldOptions,
}: IFieldGroupFieldProps) => {
	return (
		<div className={cxBind('a-field-group-field')}>
			<div className="u-row">
				<RenderFields fieldPrefix={`${name}.`} fields={fieldConfiguration?.fields as IField[] || []} />
			</div>
		</div>
	);
};
