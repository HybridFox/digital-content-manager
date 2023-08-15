import { IAPIError, useHeaderStore, useLanguageStore } from '@ibs/shared';
import { useEffect } from 'react';
import { CheckboxField, SelectField, TextField } from '@ibs/forms';
import { useTranslation } from 'react-i18next';
import { Alert, AlertTypes, Button, HTMLButtonTypes, Header, Loading } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { generatePath, useNavigate } from 'react-router-dom';

import { SITE_PATHS } from '../../sites.routes';
import { useSiteStore } from '../../stores/site';

import { createSiteSchema } from './site-create.const';

interface CreateSiteForm {
	name: string;
	languages: string[];
}

export const SiteCreatePage = () => {
	const navigate = useNavigate();
	const [languages, languagesLoading, fetchLanguages] = useLanguageStore((state) => [
		state.languages,
		state.languagesLoading,
		state.fetchLanguages,
	]);
	const [createSiteLoading, createSite] = useSiteStore((state) => [state.createSiteLoading, state.createSite]);
	const { t } = useTranslation();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const formMethods = useForm<CreateSiteForm>({
		resolver: yupResolver(createSiteSchema),
	});

	const {
		handleSubmit,
		formState: { errors },
		setError,
	} = formMethods;

	useEffect(() => {
		fetchLanguages({ pagesize: -1 });
		setBreadcrumbs([{ label: t(`BREADCRUMBS.SITES`), to: SITE_PATHS.ROOT }, { label: t(`BREADCRUMBS.CREATE`) }]);
	}, []);

	const onSubmit = (values: CreateSiteForm) => {
		createSite(values)
			.then((site) => navigate(generatePath(SITE_PATHS.DETAIL, { rootSiteId: site.id })))
			.catch((error: IAPIError) => {
				setError('root', {
					message: error.code,
				});
			});
	};

	return (
		<>
			<Header breadcrumbs={breadcrumbs} title={t('SITES.TITLES.CREATE')}></Header>
			<div className="u-margin-top">
				<Loading loading={languagesLoading}>
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
							<Button htmlType={HTMLButtonTypes.SUBMIT} disabled={!!Object.keys(errors).length}>
								{createSiteLoading && <i className="las la-redo-alt la-spin"></i>} Save
							</Button>
						</form>
					</FormProvider>
				</Loading>
			</div>
		</>
	);
};
