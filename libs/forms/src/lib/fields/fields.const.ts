import { FC, lazy } from "react";

import { FIELD_KEYS } from "~shared";

const TextField = lazy(async () => ({
	default: (await import('./text-field')).TextField
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

export const FIELD_COMPONENTS: Record<FIELD_KEYS, FC<any>> = {
	[FIELD_KEYS.FIELD_GROUP]: FieldGroupField,
	[FIELD_KEYS.TEXT]: TextField,
	[FIELD_KEYS.TEXTAREA]: TextareaField,
	[FIELD_KEYS.NUMBER]: TextField,
	[FIELD_KEYS.RICH_TEXT]: RichtextField,
	[FIELD_KEYS.URL]: TextField,
	[FIELD_KEYS.SELECT]: SelectField,
	[FIELD_KEYS.RADIO]: TextField,
	[FIELD_KEYS.CHECKBOX]: CheckboxField,
	[FIELD_KEYS.MAP]: TextField,
	[FIELD_KEYS.MEDIA]: AssetField,
	[FIELD_KEYS.TOGGLE]: TextField,
	[FIELD_KEYS.CONTENT_REFERENCE]: ContentReferenceField,
	[FIELD_KEYS.CONTENT_TYPES]: ContentTypesField,
	[FIELD_KEYS.DATETIME]: DatetimeField,
}
