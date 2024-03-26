import { FC, useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';

import { Button, ButtonSizes, ButtonTypes } from '~components';

import { IRenderMultipleProps } from './render-multiple.types';
import styles from './render-multiple.module.scss';

import { FieldGroupHeader, FieldViewMode } from '~forms';
import { arrayMove } from '~shared';
const cxBind = cx.bind(styles);

export const RenderMultiple: FC<IRenderMultipleProps> = ({ field, children, fieldPrefix = '', viewMode }: IRenderMultipleProps) => {
	const { t } = useTranslation();
	const { control, getValues } = useFormContext();
	const { fields, append, remove } = useFieldArray({
		control,
		name: `${fieldPrefix}${field.slug}`,
		shouldUnregister: true,
	});

	const defaultValues = useMemo(
		() =>
			(field.contentComponent?.fields || []).length
				? field.contentComponent?.fields.reduce((acc, field) => ({ ...acc, [field.slug]: null }), {})
				: null,
		[field]
	);

	const handleSwap = (indexA: number, indexB: number): void => {
		// collect all fields
		const movingValues = getValues(`${fieldPrefix}${field.slug}`);

		// Reset all fields
		remove();

		// Then insert all fields one per one
		setTimeout(() => {
			const movedValues = arrayMove(movingValues, indexA, indexB);
			movedValues.forEach((value) => append(value, { shouldFocus: false }))
		});
	};

	return (
		<div className={cxBind('o-render-multiple')}>
			<FieldGroupHeader
				viewMode={viewMode}
				label={field.name}
				multiLanguage={field?.multiLanguage}
				badge="Array"
				name={`${fieldPrefix}${field.slug}`}
			/>
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
										onClick={() => handleSwap(index, index - 1)}
									>
										<i className="las la-angle-up"></i>
									</Button>
									<Button
										disabled={index === fields.length - 1}
										size={ButtonSizes.EXTRA_SMALL}
										type={ButtonTypes.OUTLINE}
										onClick={() => handleSwap(index, index + 1)}
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
				<button
					type="button"
					className={cxBind('o-render-multiple__add')}
					onClick={() =>
						append(defaultValues)
					}
				>
					<i className="las la-plus"></i>
					<p>
						Add <i>"{field.name}"</i> entry
					</p>
				</button>
			)}
		</div>
	);
};
