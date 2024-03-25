import * as yup from 'yup'

import { DataTypes, IField } from "../stores";

export enum ValidationTypes {
	REQUIRED = 'REQUIRED',
	MIN_LENGTH = 'MIN_LENGTH',
	MAX_LENGTH = 'MAX_LENGTH',
	LENGTH = 'LENGTH',
	MATCHES = 'MATCHES',
	URL = 'URL',
	UUID = 'UUID',
	LOWERCASE = 'LOWERCASE',
	UPPERCASE = 'UPPERCASE'
}

export interface IValidationConfig {
	name: string;
	hint?: string;
	fields: IField[];
	applicableDataTypes: DataTypes[];
	validationHandler: (existingSchema: yup.AnySchema, field: IField, configuration: Record<string, string>) => yup.Schema
}
