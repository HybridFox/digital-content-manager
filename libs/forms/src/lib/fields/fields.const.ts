import { FC, lazy } from "react";

import { FieldKeys } from "~shared";

const TextField = lazy(async () => ({
	default: (await import('./text-field')).TextField
}));
const NumberField = lazy(async () => ({
	default: (await import('./number-field')).NumberField
}));
const TextareaField = lazy(async () => ({
	default: (await import('./textarea-field')).TextareaField
}));
const SelectField = lazy(async () => ({
	default: (await import('./select-field')).SelectField
}));
const FieldGroupField = lazy(async () => ({
	default: (await import('./field-group-field')).FieldGroupField
}));
const RichtextField = lazy(async () => ({
	default: (await import('./richtext-field')).RichtextField
}));
const AssetField = lazy(async () => ({
	default: (await import('./asset-field')).AssetField
}));
const CheckboxField = lazy(async () => ({
	default: (await import('./checkbox-field')).CheckboxField
}));
const ContentTypesField = lazy(async () => ({
	default: (await import('./content-types-field')).ContentTypesField
}));
const ContentReferenceField = lazy(async () => ({
	default: (await import('./content-reference-field')).ContentReferenceField
}));
const DatetimeField = lazy(async () => ({
	default: (await import('./datetime-field')).DatetimeField
}));
const ContentComponentsField = lazy(async () => ({
	default: (await import('./content-components-field')).ContentComponentsField
}));
const BlockField = lazy(async () => ({
	default: (await import('./block-field')).BlockField
}));

export const FIELD_COMPONENTS: Record<FieldKeys, FC<any>> = {
	[FieldKeys.FIELD_GROUP]: FieldGroupField,
	[FieldKeys.TEXT]: TextField,
	[FieldKeys.TEXTAREA]: TextareaField,
	[FieldKeys.NUMBER]: NumberField,
	[FieldKeys.RICH_TEXT]: RichtextField,
	[FieldKeys.URL]: TextField,
	[FieldKeys.SELECT]: SelectField,
	[FieldKeys.RADIO]: TextField,
	[FieldKeys.CHECKBOX]: CheckboxField,
	[FieldKeys.MAP]: TextField,
	[FieldKeys.MEDIA]: AssetField,
	[FieldKeys.TOGGLE]: TextField,
	[FieldKeys.CONTENT_REFERENCE]: ContentReferenceField,
	[FieldKeys.CONTENT_TYPES]: ContentTypesField,
	[FieldKeys.DATETIME]: DatetimeField,
	[FieldKeys.CONTENT_COMPONENTS]: ContentComponentsField,
	[FieldKeys.BLOCK]: BlockField,
}
