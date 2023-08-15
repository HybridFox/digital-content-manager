import {
	IAPIError,
	useHeaderStore,
	useLanguageStore
} from '@ibs/shared';
import { useEffect } from 'react';
import { CheckboxField, SelectField, TextField } from '@ibs/forms';
import { Trans, useTranslation } from 'react-i18next';
import { Alert, AlertTypes, Button, HTMLButtonTypes, Header, Loading } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';

import { SITE_PATHS } from '../../sites.routes';
import { useSiteStore } from '../../stores/site';

import { updateSiteSchema } from './site-detail.const';

interface UpdateSiteForm {
	name: string;
	languages: string[];
}

export const SiteDetailPage = () => {
	const navigate = useNavigate();
	const [languages, languagesLoading, fetchLanguages] = useLanguageStore((state) => [
		state.languages,
		state.languagesLoading,
		state.fetchLanguages,
	]);
	const [site, siteLoading, fetchSite] = useSiteStore((state) => [state.site, state.siteLoading, state.fetchSite]);
	const [updateSiteLoading, updateSite] = useSiteStore((state) => [
		state.updateSiteLoading,
		state.updateSite,
	]);
	const { rootSiteId } = useParams();
	const { t } = useTranslation();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
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
		fetchLanguages({ pagesize: -1 });
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.SITES`), to: SITE_PATHS.ROOT },
			{ label: t(`BREADCRUMBS.EDIT`) },
		]);
	}, []);

	useEffect(() => {
		if (!rootSiteId) {
			return;
		}

		fetchSite(rootSiteId);
	}, [rootSiteId]);

	const onSubmit = (values: UpdateSiteForm) => {
		updateSite(rootSiteId!, values)
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
				title={<Trans t={t} i18nKey="SITES.TITLES.EDIT" values={{ siteName: site?.name || '...' }} />}
			></Header>
			<div className="u-margin-top">
				<Loading loading={languagesLoading || siteLoading}>
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
								{updateSiteLoading && <i className="las la-redo-alt la-spin"></i>} Save
							</Button>
						</form>
					</FormProvider>
				</Loading>
			</div>
		</>
	);
};
