import { CONTENT_TYPE_KINDS_TRANSLATIONS, IAPIError, useContentTypeStore, useHeaderStore } from '@ibs/shared';
import { useEffect } from 'react';
import { RenderFields, TextField } from '@ibs/forms';
import { useTranslation } from 'react-i18next';
import { Alert, AlertTypes, Button, ButtonTypes, HTMLButtonTypes } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { CONTENT_PATHS } from '../../content.routes';
import { IContentItem, useContentStore } from '../../stores/content';

export const ContentDetailFieldsPage = () => {
	const [contentType] = useContentTypeStore((state) => [state.contentType]);
	const [updateContentItem, updateContentItemLoading] = useContentStore((state) => [state.updateContentItem, state.updateContentItemLoading]);
	const [contentItem] = useContentStore((state) => [state.contentItem]);
	const { t } = useTranslation();
	const { siteId } = useParams();
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
			{ label: t(`BREADCRUMBS.${contentType?.kind?.toUpperCase()}`), to: CONTENT_PATHS.ROOT },
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
					<RenderFields fieldPrefix="fields." fields={contentType?.fields || []} />
				</div>
				<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>{updateContentItemLoading && <i className="las la-redo-alt la-spin"></i>} Save</Button>
			</form>
		</FormProvider>
	);
};
