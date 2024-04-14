import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'react-router-dom';

import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes } from '~components';
import { SelectField, TextField } from '~components';

import { SITE_PATHS } from '../../sites.routes';
import { useSiteStore } from '../../stores/site';

import { updateSiteSchema } from './site-detail-settings.const';

import {
	IAPIError,
	useHeaderStore,
	useLanguageStore
} from '~shared';

interface UpdateSiteForm {
	name: string;
	languages: string[];
}

export const SiteDetailSettingsPage = () => {
	const [languages] = useLanguageStore((state) => [
		state.languages,
	]);
	const [site] = useSiteStore((state) => [state.site]);
	const [updateSiteLoading, updateSite] = useSiteStore((state) => [
		state.updateSiteLoading,
		state.updateSite,
	]);
	const { rootSiteId } = useParams();
	const { t } = useTranslation();
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);
	const formMethods = useForm<UpdateSiteForm>({
		resolver: yupResolver(updateSiteSchema),
		values: {
			name: '',
			...site,
			languages: (site?.languages || []).map((language) => language.id)
		},
	});

	const {
		handleSubmit,
		formState: { errors },
		setError,
	} = formMethods;

	useEffect(() => {
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.SITES`), to: SITE_PATHS.ROOT },
			{ label: site?.name },
			{ label: t(`BREADCRUMBS.SETTINGS`) },
		]);
	}, [site]);

	const onSubmit = (values: UpdateSiteForm) => {
		updateSite(rootSiteId!, values)
			.catch((error: IAPIError) => {
				setError('root', {
					message: error.code,
				});
			});
	};

	return (
		<FormProvider {...formMethods}>
			<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>
				{errors?.root?.message}
			</Alert>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="u-margin-bottom">
					<TextField name="name" label="Name" />
				</div>
				<div className="u-margin-bottom">
					<SelectField
						name="languages"
						field={{ min: 1, max: 0 }}
						fieldConfiguration={{ options: languages.map((language) => ({ label: language.name, value: language.id })) }}
						label="Languages"
					/>
				</div>
				<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT} disabled={!!Object.keys(errors).length}>
					{updateSiteLoading && <i className="las la-redo-alt la-spin"></i>} Save
				</Button>
			</form>
		</FormProvider>
	);
};
