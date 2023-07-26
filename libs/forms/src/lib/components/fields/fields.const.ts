import { FC } from "react";
import { FIELD_KEYS } from "@ibs/shared";

import { TextField } from "./text-field";
import { TextareaField } from "./textarea-field";
import { SelectField } from "./select-field";
import { FieldGroupField } from "./field-group-field/field-group-field.component";

export const FIELD_COMPONENTS: Record<FIELD_KEYS, FC<any>> = {
	[FIELD_KEYS.FIELD_GROUP]: FieldGroupField,
	[FIELD_KEYS.TEXT]: TextField,
	[FIELD_KEYS.TEXTAREA]: TextareaField,
	[FIELD_KEYS.NUMBER]: TextField,
	[FIELD_KEYS.RICH_TEXT]: TextField,
	[FIELD_KEYS.URL]: TextField,
	[FIELD_KEYS.SELECT]: SelectField,
	[FIELD_KEYS.RADIO]: TextField,
	[FIELD_KEYS.CHECKBOX]: TextField,
	[FIELD_KEYS.MAP]: TextField,
	[FIELD_KEYS.MEDIA]: TextField,
	[FIELD_KEYS.TOGGLE]: TextField,
	[FIELD_KEYS.REFERENCE]: TextField,
}
