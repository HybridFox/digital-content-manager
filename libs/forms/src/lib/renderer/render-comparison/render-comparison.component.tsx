import { FC, Suspense } from 'react';
import { FIELD_KEYS, IField } from '@ibs/shared';
import classNames from 'classnames';
import cx from 'classnames/bind';
import { Alert, Loading } from '@ibs/components';

import { FIELD_COMPONENTS } from '../../fields';
import { RenderMultiple } from '../render-multiple';
import { FIELD_VIEW_MODE } from '../../fields/fields.types';

import styles from './render-comparison.module.scss';
import { IRenderComparisonProps } from './render-comparison.types';
const cxBind = cx.bind(styles);

export const RenderComparison: FC<IRenderComparisonProps> = ({
	fields,
	fieldPrefix = '',
	siteId,
	viewMode = FIELD_VIEW_MODE.EDIT,
}: IRenderComparisonProps) => {
	const renderContentComponent = (field: IField) => {
		const Component = FIELD_COMPONENTS[field.contentComponent.componentName];

		if (!Component) {
			return <Alert>Component not found: {field.contentComponent.componentName}</Alert>;
		}

		const fieldConfiguration = {
			...field.config,
			fields: [...(field.config?.fields || []), ...(field.contentComponent.fields || [])],
			multiLanguage: field.multiLanguage,
		};

		if (
			(field.min === 1 && field.max === 1) ||
			[FIELD_KEYS.MEDIA, FIELD_KEYS.CONTENT_REFERENCE, FIELD_KEYS.SELECT].includes(field.contentComponent.componentName)
		) {
			return (
				<div className={cxBind('o-comparison__wrapper')}>
					<div className={cxBind('o-comparison__field')}>
						<Component
							viewMode={viewMode}
							siteId={siteId}
							name={`0.${fieldPrefix}${field.slug}`}
							label={field.name}
							fieldConfiguration={fieldConfiguration}
							field={field}
						/>
					</div>
					<div className={cxBind('o-comparison__field')}>
						<Component
							viewMode={viewMode}
							siteId={siteId}
							name={`1.${fieldPrefix}${field.slug}`}
							label={field.name}
							fieldConfiguration={fieldConfiguration}
							field={field}
						/>
					</div>
				</div>
			);
		}

		return (
			<div className={cxBind('o-comparison__wrapper')}>
				<div className={cxBind('o-comparison__field')}>
					<RenderMultiple viewMode={viewMode} fieldPrefix={`0.${fieldPrefix}`} field={field}>
						{(index) => (
							<Component
								viewMode={viewMode}
								siteId={siteId}
								name={`0.${fieldPrefix}${field.slug}.${index}`}
								label={field.name}
								fieldConfiguration={fieldConfiguration}
								field={field}
							/>
						)}
					</RenderMultiple>
				</div>
				<div className={cxBind('o-comparison__field')}>
					<RenderMultiple viewMode={viewMode} fieldPrefix={`1.${fieldPrefix}`} field={field}>
						{(index) => (
							<Component
								viewMode={viewMode}
								siteId={siteId}
								name={`1.${fieldPrefix}${field.slug}.${index}`}
								label={field.name}
								fieldConfiguration={fieldConfiguration}
								field={field}
							/>
						)}
					</RenderMultiple>
				</div>
			</div>
		);
	};

	return (
		<>
			{fields.map((field) => (
				<div className={classNames(cxBind('o-fields__field'), field.config?.wrapperClassName)} key={field.name}>
					<Suspense fallback={<Loading loading={true} />}>{renderContentComponent(field)}</Suspense>
				</div>
			))}
		</>
	);
};
