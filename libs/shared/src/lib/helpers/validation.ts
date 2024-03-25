import * as yup from 'yup'

import { IValidationConfig, ValidationTypes } from '../const';
import { DataTypes, FieldKeys, IField } from "../stores";

export const ValidationConfiguration: Record<ValidationTypes, IValidationConfig> = {
	[ValidationTypes.REQUIRED]: {
		name: "Required",
		hint: 'Makes the field required',
		fields: [],
		applicableDataTypes: [DataTypes.TEXT, DataTypes.BOOLEAN, DataTypes.NUMBER, DataTypes.OBJECT],
		validationHandler: (existingSchema, field) => existingSchema.required(),
	},
	[ValidationTypes.MAX_LENGTH]: {
		name: 'Maximum length',
		fields: [{
			name: 'Maximum Length',
			slug: 'maxLength',
			contentComponent: {
				componentName: FieldKeys.NUMBER,
				configurationFields: [],
				fields: [],
			}
		}],
		applicableDataTypes: [DataTypes.TEXT],
		validationHandler: (existingSchema, field, config) => (existingSchema as yup.StringSchema).max(Number(config.maxLength)),
	},
	[ValidationTypes.MIN_LENGTH]: {
		name: 'Minimum length',
		fields: [{
			name: 'Minimum Length',
			slug: 'minLength',
			contentComponent: {
				componentName: FieldKeys.NUMBER,
				configurationFields: [],
				fields: [],
			}
		}],
		applicableDataTypes: [DataTypes.TEXT],
		validationHandler: (existingSchema, field, config) => (existingSchema as yup.StringSchema).min(Number(config.minLength)),
	},
	[ValidationTypes.LENGTH]: {
		name: 'Specific length',
		fields: [{
			name: 'Specific Length',
			slug: 'length',
			contentComponent: {
				componentName: FieldKeys.NUMBER,
				configurationFields: [],
				fields: [],
			}
		}],
		applicableDataTypes: [DataTypes.TEXT],
		validationHandler: (existingSchema, field, config) => (existingSchema as yup.StringSchema).length(Number(config.length)),
	},
	[ValidationTypes.MATCHES]: {
		name: 'Matches',
		hint: 'Match a specific regex',
		fields: [{
			name: 'RegEx',
			slug: 'regex',
			contentComponent: {
				componentName: FieldKeys.TEXT,
				configurationFields: [],
				fields: [],
			}
		}],
		applicableDataTypes: [DataTypes.TEXT],
		validationHandler: (existingSchema, field, config) => (existingSchema as yup.StringSchema).matches(new RegExp(config.regex)),
	},
	[ValidationTypes.UUID]: {
		name: 'UUID',
		hint: 'Is a UUID',
		fields: [],
		applicableDataTypes: [DataTypes.TEXT],
		validationHandler: (existingSchema, field, config) => (existingSchema as yup.StringSchema).uuid(),
	},
	[ValidationTypes.URL]: {
		name: 'URL',
		hint: 'Check if the text is a URL',
		fields: [],
		applicableDataTypes: [DataTypes.TEXT],
		validationHandler: (existingSchema, field, config) => (existingSchema as yup.StringSchema).url(),
	},
	[ValidationTypes.LOWERCASE]: {
		name: 'Lowercase',
		hint: 'Check if the text is in lowercase',
		fields: [],
		applicableDataTypes: [DataTypes.TEXT],
		validationHandler: (existingSchema, field, config) => (existingSchema as yup.StringSchema).lowercase().strict(),
	},
	[ValidationTypes.UPPERCASE]: {
		name: 'Uppercase',
		hint: 'Check if the text is in uppercase',
		fields: [],
		applicableDataTypes: [DataTypes.TEXT],
		validationHandler: (existingSchema, field, config) => (existingSchema as yup.StringSchema).uppercase().strict(),
	}
}

export const generateValidationSchema = (fields: IField[]): yup.ObjectSchema<any, any> => {
    return yup.object({
		fields: yup.object({
			...fields.reduce((acc, field) => {
				const validation = getObjectValidation(field);

				if (!validation) {
					return acc;
				}

				return {
					[field.slug]: validation,
					...acc,
				}
			}, {})
		})
	})
}

const parseFieldType = (field: IField): yup.Schema => {
    const schemas: Record<DataTypes, yup.Schema> = {
        [DataTypes.TEXT]: yup.string(),
        [DataTypes.ARRAY]: yup.string(),
        [DataTypes.BLOCK]: yup.string(),
        [DataTypes.BOOLEAN]: yup.bool(),
        [DataTypes.NUMBER]: yup.number(),
        [DataTypes.OBJECT]: yup.object(),
        [DataTypes.REFERENCE]: yup.string(),
    }

	return field.contentComponent.dataType ? schemas[field.contentComponent.dataType] ?? yup.mixed() : yup.mixed();
}

const getObjectValidation = (field: IField, skipSpecialChecks = false): yup.Schema | undefined => {
	// If there is validation, BUT the field is multiple
	if ((field.min !== 1 || field.max !== 1) && skipSpecialChecks !== true) {
		return yup.array(getObjectValidation(field, true)).min(Number(field.min)).max(Number(field.max)).label(field.name);
	}

	if (field.contentComponent.fields?.length > 0) {
		return applyValidationRulesToSchema(yup.object({
			...field.contentComponent.fields.reduce((acc, field) => {
				const validation = getObjectValidation(field);

				if (!validation) {
					return acc;
				}

				return {
					[field.slug]: validation,
					...acc,
				}
			}, {})
		}), field) as yup.ObjectSchema<any>;
	}

	if (!field.validation || Object.keys(field.validation).length === 0) {
		return undefined;
	}

	return applyValidationRulesToSchema(parseFieldType(field).label(field.name), field);
}

const applyValidationRulesToSchema = (rootSchema: yup.Schema, field: IField): yup.Schema => {
	return Object.keys(field.validation || {}).reduce((existingSchema, validationType) => {
		// Look up validation
		const validationConfiguration: IValidationConfig = ValidationConfiguration[validationType as ValidationTypes];

		if (!validationConfiguration) {
			return existingSchema;
		}

		return validationConfiguration.validationHandler(existingSchema, field, field.validation?.[validationType] || {});
	}, rootSchema)
}
