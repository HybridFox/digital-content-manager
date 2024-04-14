import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { generatePath, useParams } from 'react-router-dom';

import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes } from '~components';
import { TextField } from '~components';

import { CONTENT_PATHS } from '../../content.routes';

import { CONTENT_TYPE_KINDS_TRANSLATIONS, IAPIError, IContentItem, useContentStore, useContentTypeStore, useHeaderStore } from '~shared';

export const ContentDetailSettingsPage = () => {
	const [contentType] = useContentTypeStore((state) => [state.contentType]);
	const [updateContentItem, updateContentItemLoading] = useContentStore((state) => [state.updateContentItem, state.updateContentItemLoading]);
	const [contentItem] = useContentStore((state) => [state.contentItem]);
	const { t } = useTranslation();
	const { siteId, kind } = useParams();
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);
	const formMethods = useForm<IContentItem>({
		// resolver: yupResolver(editFieldSchema),
		values: contentItem,
	});

	const {
		handleSubmit,
		formState: { errors },
		setError,
	} = formMethods;

	useEffect(() => {
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.${kind?.toUpperCase()}`), to: generatePath(CONTENT_PATHS.ROOT, { siteId, kind }) },
			{
				label: contentType?.name,
				badge: contentType && CONTENT_TYPE_KINDS_TRANSLATIONS[contentType.kind],
			},
			{ label: 'Fields' },
		]);
	}, [contentItem, contentType]);

	const onSubmit = (values: IContentItem) => {
		if (!contentItem) {
			return;
		}

		updateContentItem(siteId!, contentItem.id, values).catch((error: IAPIError) => {
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
					<TextField name="name" label="Administrative Name" />
				</div>
				<div className="u-margin-bottom">
					<TextField name="slug" label="Slug" />
				</div>
				<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>{updateContentItemLoading && <i className="las la-redo-alt la-spin"></i>} Save</Button>
			</form>
		</FormProvider>
	);
};
