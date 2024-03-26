import { FC } from 'react';
import { useFieldArray } from 'react-hook-form';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';

import { Button, ButtonSizes, ButtonTypes } from '~components';

import { IRenderMultipleProps } from './render-multiple.types';
import styles from './render-multiple.module.scss';

import { FieldGroupHeader, FieldViewMode } from '~forms';
const cxBind = cx.bind(styles);

export const RenderMultiple: FC<IRenderMultipleProps> = ({ field, children, fieldPrefix = '', viewMode }: IRenderMultipleProps) => {
	const { t } = useTranslation();
	const { fields, append, remove, move } = useFieldArray({
		name: `${fieldPrefix}${field.slug}`,
	});

	return (
		<div className={cxBind('o-render-multiple')}>
			<FieldGroupHeader viewMode={viewMode} label={field.name} multiLanguage={field?.multiLanguage} badge="Array" name={`${fieldPrefix}${field.slug}`} />
			<div className={cxBind('o-render-multiple__fields')}>
				{viewMode === FieldViewMode.VIEW && fields.length === 0 && (
					<span className="u-text--light u-text--small">{t('GENERAL.LABELS.NO_DATA')}</span>
				)}
				{fields.map((_, index) => (
					<div className={cxBind('o-render-multiple__field')} key={index}>
						{viewMode === FieldViewMode.EDIT && (
							<div className={cxBind('o-render-multiple__field__actions')}>
								<div className={cxBind('o-render-multiple__field__order')}>
									<Button
										disabled={index === 0}
										size={ButtonSizes.EXTRA_SMALL}
										type={ButtonTypes.OUTLINE}
										onClick={() => move(index, index - 1)}
									>
										<i className="las la-angle-up"></i>
									</Button>
									<Button
										disabled={index === fields.length - 1}
										size={ButtonSizes.EXTRA_SMALL}
										type={ButtonTypes.OUTLINE}
										onClick={() => move(index, index + 1)}
									>
										<i className="las la-angle-down"></i>
									</Button>
								</div>
								<Button size={ButtonSizes.EXTRA_SMALL} onClick={() => remove(index)}>
									<i className="las la-trash"></i>
								</Button>
							</div>
						)}
						<div className={cxBind('o-render-multiple__field__content')}>{children(index)}</div>
					</div>
				))}
			</div>
			{viewMode === FieldViewMode.EDIT && (
				<button type="button" className={cxBind('o-render-multiple__add')} onClick={() => append((field.contentComponent?.fields || []).reduce((acc, field) => ({ ...acc, [field.slug]: null }), {}))}>
					<i className="las la-plus"></i>
					<p>
						Add <i>"{field.name}"</i> entry
					</p>
				</button>
			)}
		</div>
	);
};
