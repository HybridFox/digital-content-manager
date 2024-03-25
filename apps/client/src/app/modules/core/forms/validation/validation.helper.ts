import { IEditValidationForm } from "./validation.types";

import { IField } from "~shared";

export const fieldToValidationForm = (field?: IField): IEditValidationForm => {
	if (!field) {
		return {
			validationRules: {},
			validationRulesEnabled: []
		};
	}

	return {
		validationRulesEnabled: Object.keys(field.validation || {}),
		validationRules: field.validation,
	}
}

export const validationFormToField = (submitHandler: (field: IField) => void, field: IField) => (formValues: IEditValidationForm) => {
	submitHandler({
		...field,
		validation: formValues.validationRulesEnabled.reduce((acc, validationRule) => {
			return {
				...acc,
				[validationRule]: formValues.validationRules?.[validationRule] || {}
			}
		}, {})
	})
}
