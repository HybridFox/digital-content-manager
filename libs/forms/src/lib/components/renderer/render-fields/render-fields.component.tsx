import { FC } from "react";
import { IField } from "@ibs/shared";
import classNames from "classnames";

import { FIELD_COMPONENTS } from "../../fields";
import { RenderMultiple } from "../render-multiple";

import { IRenderFieldsProps } from "./render-fields.types";

export const RenderFields: FC<IRenderFieldsProps> = ({ fields, fieldPrefix = '' }: IRenderFieldsProps) => {
	const renderContentComponent = (field: IField) => {
		const Component = FIELD_COMPONENTS[field.contentComponent.componentName];

		if (!Component) {
			return <p>Component not found</p>
		}

		if (field.min === 1 && field.max === 1) {
			return <Component name={`${fieldPrefix}${field.slug}`} label={field.name} fieldConfiguration={field.config} />
		}

		return <RenderMultiple fieldPrefix={fieldPrefix} field={field}>
			{(index) => <Component name={`${fieldPrefix}${field.slug}.${index}`} label={field.name} fieldConfiguration={field.config} />}
		</RenderMultiple>
	}

	return <>
		{fields.map((field) => (
			<div className={classNames('u-margin-bottom', field.config?.wrapperClassName)} key={field.name}>
				{renderContentComponent(field)}
			</div>
		))}
	</>
}
