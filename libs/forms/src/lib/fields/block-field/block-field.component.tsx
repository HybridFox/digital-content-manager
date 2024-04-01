import { FC, useEffect, useMemo, useState } from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Badge, BadgeSizes, Button, ButtonSizes, ButtonTypes, Loading, Modal, RenderFields } from '~components';

import { IBlockFieldProps } from './block-field.types';
import styles from './block-field.module.scss';

import { FieldGroupHeader, FIELD_COMPONENTS, FieldViewMode } from '~forms';
import { arrayMove, FieldKeys, IContentComponent, IField, useContentComponentStore } from '~shared';

const cxBind = cx.bind(styles);

export const BlockField: FC<IBlockFieldProps> = ({ name, label, fieldConfiguration, field, siteId, viewMode }: IBlockFieldProps) => {
	const { t } = useTranslation();
	const [modalVisible, setModalVisible] = useState(false);
	const [contentComponents, contentComponentsLoading, fetchContentComponents] = useContentComponentStore((state) => [
		state.contentComponents,
		state.contentComponentsLoading,
		state.fetchContentComponents,
	]);
	const { control, getValues } = useFormContext();
	const { fields, append, remove } = useFieldArray({
		control,
		name,
	});

	const handleSwap = (indexA: number, indexB: number): void => {
		// collect all fields
		const movingValues = getValues(name);

		// Reset all fields
		remove();

		// Then insert all fields one per one
		setTimeout(() => {
			const movedValues = arrayMove(movingValues, indexA, indexB);
			movedValues.forEach((value) => append(value, { shouldFocus: false }));
		});
	};

	useEffect(() => {
		if (!siteId) {
			return;
		}

		fetchContentComponents(siteId, { pagesize: -1, includeInternal: true });
	}, []);

	const handleBlockSelection = (block: IField) => {
		setModalVisible(false);
		console.log(block);
		append({
			fields: {},
			block: block.slug,
		});
	};

	return (
		<Loading loading={contentComponentsLoading}>
			<div className={cxBind('o-block-field')}>
				<FieldGroupHeader viewMode={viewMode} label={label} multiLanguage={fieldConfiguration?.multiLanguage as boolean} badge="Blocks" />
				<div className={cxBind('o-block-field__fields')}>
					{viewMode === FieldViewMode.VIEW && fields.length === 0 && (
						<span className="u-text--light u-text--small">{t('GENERAL.LABELS.NO_DATA')}</span>
					)}
					{fields.map((contentBlock: any, index) => {
						const block = field?.blocks?.find(({ slug }) => slug === contentBlock.block);

						if (!block) {
							return null;
						}

						return (
							<div className={cxBind('o-block-field__field')} key={index}>
								{viewMode === FieldViewMode.EDIT && (
									<div className={cxBind('o-block-field__field__actions')}>
										<div className={cxBind('o-block-field__field__order')}>
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
								<RenderFields siteId={siteId!} fieldPrefix={`${name}.${index}.fields.`} fields={[block]} />
							</div>
						);
					})}
				</div>
				{viewMode === FieldViewMode.EDIT && (
					<button type="button" className={cxBind('o-block-field__add')} onClick={() => setModalVisible(true)}>
						<i className="las la-plus"></i>
						<p>
							Add <i>"{label}"</i> block
						</p>
					</button>
				)}
			</div>
			<Modal modalOpen={modalVisible} title="Select block" onClose={() => setModalVisible(false)}>
				<div className={cxBind('o-block-field__content-components')}>
					{(field?.blocks || []).map((block) => {
						return (
							<div key={block.id} onClick={() => handleBlockSelection(block)} className={cxBind('o-block-field__cc')}>
								<p>{block.name}</p>
								<div className="u-display-flex">
									<Badge size={BadgeSizes.SMALL} className="u-margin-right-xs">
										{block.contentComponent.name}
									</Badge>
									<Badge size={BadgeSizes.SMALL}>
										{block.contentComponent.internal
											? t(`CONTENT_COMPONENTS.KINDS.INTERNAL`)
											: t(`CONTENT_COMPONENTS.KINDS.CUSTOM`)}
									</Badge>
								</div>
							</div>
						);
					})}
				</div>
			</Modal>
		</Loading>
	);
};
