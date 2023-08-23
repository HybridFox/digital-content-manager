import { FC, Suspense } from "react";
import { FIELD_KEYS, IField } from "@ibs/shared";
import classNames from "classnames";
import cx from "classnames/bind";
import { Alert, Loading } from "@ibs/components";

import { FIELD_COMPONENTS } from "../../fields";
import { RenderMultiple } from "../render-multiple";

import styles from './render-fields.module.scss';
import { IRenderFieldsProps } from "./render-fields.types";
const cxBind = cx.bind(styles);

export const RenderFields: FC<IRenderFieldsProps> = ({ fields, fieldPrefix = '', siteId }: IRenderFieldsProps) => {
	const renderContentComponent = (field: IField) => {
		const Component = FIELD_COMPONENTS[field.contentComponent.componentName];

		if (!Component) {
			return <Alert>Component not found: {field.contentComponent.componentName}</Alert>
		}

		const fieldConfiguration = {
			...field.config,
			fields: [
				...field.config?.fields || [],
				...field.contentComponent.fields || [],
			],
			multiLanguage: field.multiLanguage,
		};

		if (field.min === 1 && field.max === 1 || [FIELD_KEYS.MEDIA, FIELD_KEYS.CONTENT_REFERENCE, FIELD_KEYS.SELECT].includes(field.contentComponent.componentName)) {
			// TODO: Check the `config.fields` vs `contentComponent.fields`, is there are reason for this? If yes, can we make this cleaner?
			return <Component siteId={siteId} name={`${fieldPrefix}${field.slug}`} label={field.name} fieldConfiguration={fieldConfiguration} field={field} />
		}

		// TODO: Ditto
		return <RenderMultiple fieldPrefix={fieldPrefix} field={field}>
			{(index) => <Component siteId={siteId} name={`${fieldPrefix}${field.slug}.${index}`} label={field.name} fieldConfiguration={fieldConfiguration} field={field} />}
		</RenderMultiple>
	}

	return <>
		{fields.map((field) => (
			<div className={classNames(cxBind('o-fields__field'), field.config?.wrapperClassName)} key={field.name}>
				<Suspense fallback={<Loading loading={true} />}>
					{renderContentComponent(field)}
				</Suspense>
			</div>
		))}
	</>
}
