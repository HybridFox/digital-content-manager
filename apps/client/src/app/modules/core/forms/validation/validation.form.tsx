import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import cx from 'classnames/bind';

import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes, RenderFields } from '~components';


import { IEditValidationForm, IValidationFormProps } from './validation.types';
import  styles from './validation.module.scss'
import { fieldToValidationForm, validationFormToField } from './validation.helper';

import { CheckboxField } from '~forms';
import { IValidationConfig, ValidationConfiguration, ValidationTypes } from '~shared';
const cxBind = cx.bind(styles);

export const ValidationForm: FC<IValidationFormProps> = ({ onSubmit, loading, siteId, contentTypeField }) => {
	const formMethods = useForm<IEditValidationForm>({
		values: fieldToValidationForm(contentTypeField),
	});

	const {
		handleSubmit,
		formState: { errors },
	} = formMethods;

	const validationRulesEnabled = formMethods.watch('validationRulesEnabled')
	const renderValidationRuleForm = (validationType: ValidationTypes, config: IValidationConfig) => {
		if (!config.fields.length || !(validationRulesEnabled || []).includes(validationType)) {
			return null;
		}

		return (
			<div className={cxBind('o-validation__config')}>
				<RenderFields fields={config.fields} siteId={siteId!} fieldPrefix={`validationRules.${validationType}.`} />
			</div>
		)
	}

	return (
		<FormProvider {...formMethods}>
			<form onSubmit={handleSubmit(validationFormToField(onSubmit, contentTypeField))}>
				<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>
					{errors?.root?.message}
				</Alert>
				<div className={cxBind('o-validation')}>
					{[...Object.keys(ValidationConfiguration)].map((validationType) => {
						const config = ValidationConfiguration[validationType as ValidationTypes];

						if (!config || !contentTypeField?.contentComponent?.dataType || !config.applicableDataTypes.includes(contentTypeField.contentComponent.dataType)) {
							return null;
						}

						return (
							<div key={validationType}>
								<div className={cxBind('o-validation__row')}>
									<CheckboxField name="validationRulesEnabled" fieldConfiguration={{ hint: config.hint, options: [{
										label: config.name,
										value: validationType
									}] }} />
								</div>
								{renderValidationRuleForm(validationType as ValidationTypes, config)}
							</div>
						);
					})}
				</div>
				<div className="u-margin-top">
					<Button htmlType={HTMLButtonTypes.SUBMIT} type={ButtonTypes.PRIMARY}>Save</Button>
				</div>
			</form>
		</FormProvider>
	)
}
