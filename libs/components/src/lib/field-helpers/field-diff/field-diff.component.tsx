import { FC } from 'react';
import cx from 'classnames/bind';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { diffChars } from 'diff';
import classNames from 'classnames';

import { IFieldDiffProps } from './field-diff.types';
import styles from './field-diff.module.scss';
const cxBind = cx.bind(styles);

export const FieldDiff: FC<IFieldDiffProps> = ({ name }: IFieldDiffProps) => {
	const { watch } = useFormContext();
	const { t } = useTranslation();

	const value = watch(name);

	if (name.startsWith('1.')) {
		return (
			<div className={cxBind('a-input__diff')}>
				{value ? <div dangerouslySetInnerHTML={{ __html: value }}></div> : <span className="u-text--light">{t('GENERAL.LABELS.NO_DATA')}</span>}
			</div>
		);
	}

	const oldValue = watch(name.replace('0.', '1.'));
	const charDiff = diffChars(oldValue || '', value || '');
	return (
		<div className={cxBind('a-input__diff')}>
			{charDiff.map((change, i) => (<span className={classNames({
				[cxBind('a-input__value--added')]: change.added,
				[cxBind('a-input__value--removed')]: change.removed,
			})} dangerouslySetInnerHTML={{ __html: change.value }} />))}
		</div>
	);
};
