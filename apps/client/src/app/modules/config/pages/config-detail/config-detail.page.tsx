import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';

import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes, Header, Loading } from '~components';
import { TextField } from '~components';

import { CONFIG_PATHS } from '../../config.routes';


import {
	IAPIError,
	useConfigStore,
	useHeaderStore,
} from '~shared';

type UpdateConfigForm = Record<string, string | number>;

export const ConfigDetailPage = () => {
	const [config, configLoading] = useConfigStore((state) => [
		state.config,
		state.configLoading,
		state.fetchConfig,
	]);
	const [updateConfigLoading, updateConfig] = useConfigStore((state) => [
		state.updateConfigLoading,
		state.updateConfig,
	]);

	const { t } = useTranslation();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const formMethods = useForm<UpdateConfigForm>({
		values: config
	});

	const {
		handleSubmit,
		formState: { errors },
		setError,
	} = formMethods;

	useEffect(() => {
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.CONFIG`), to: CONFIG_PATHS.ROOT },
			{ label: t(`BREADCRUMBS.EDIT`) },
		]);
	}, []);

	const onSubmit = (values: UpdateConfigForm) => {
		console.log(values)
		updateConfig(values)
			.catch((error: IAPIError) => {
				setError('root', {
					message: error.code,
				});
			});
	};

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t('CONFIG.TITLES.EDIT')}
			></Header>
			<div className="u-margin-top">
				<Loading loading={configLoading}>
					<FormProvider {...formMethods}>
						<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>
							{errors?.root?.message}
						</Alert>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="u-margin-bottom">
								<TextField name="rootName" label="Name" />
							</div>
							<div className="u-margin-bottom">
								<TextField name="rootLogoUrl" label="Logo URL" />
							</div>
							<div className="u-margin-bottom">
								<TextField name="rootLogoMobileUrl" label="Logo Mobile URL" />
							</div>
							<div className="u-margin-bottom">
								<TextField name="rootPrimaryColour" label="Primary Colour" />
							</div>
							<div className="u-margin-bottom">
								<TextField name="rootSecondaryColour" label="Secondary Colour" />
							</div>
							<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
								{updateConfigLoading && <i className="las la-redo-alt la-spin"></i>} Save
							</Button>
						</form>
					</FormProvider>
				</Loading>
			</div>
		</>
	);
};
