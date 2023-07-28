import { CONTENT_TYPE_KINDS_TRANSLATIONS, useContentTypeStore, useHeaderStore } from '@ibs/shared';
import { useEffect } from 'react';
import { generatePath, useParams } from 'react-router-dom';
import { RenderFields, TextField } from '@ibs/forms';
import { useTranslation } from 'react-i18next';
import { Button, HTMLButtonTypes, Header, Loading } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';

import { CONTENT_PATHS } from '../../content.routes';
import { useContentStore } from '../../stores/content';

interface CreateContentForm {
	name: string;
	fields: Record<string, unknown>;
}

export const ContentCreateDetailPage = () => {
	const [contentType, contentTypeLoading, fetchContentType] =
		useContentTypeStore((state) => [
			state.contentType,
			state.contentTypeLoading,
			state.fetchContentType,
		]);
	const [createContentItem, createContentItemLoading] = useContentStore((state) => ([state.createContentItem, state.createContentItemLoading]))
	const { t } = useTranslation();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const { kind, contentTypeId } = useParams();
	const formMethods = useForm<CreateContentForm>({
		// resolver: yupResolver(editFieldSchema),
		// values: contentTypeField,
	});

	const { handleSubmit } = formMethods;

	useEffect(() => {
		if (!contentTypeId) {
			return;
		}

		fetchContentType(contentTypeId);
	}, [contentTypeId]);

	useEffect(() => {
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.${kind?.toUpperCase()}`), to: CONTENT_PATHS.ROOT },
			{ label: t(`BREADCRUMBS.CREATE`), to: generatePath(CONTENT_PATHS.CREATE, { kind }) },
			{
				label: contentType?.name,
				badge: contentType && CONTENT_TYPE_KINDS_TRANSLATIONS[contentType.kind]
			}
		]);
	}, [contentType, kind]);

	const onSubmit = (values: CreateContentForm) => {
		createContentItem(values);
	}

	return (
		<>
		<Header
			breadcrumbs={breadcrumbs}
			title={<>Create content <i>"{contentType?.name}"</i></>}
		></Header>
		<div className="u-margin-top">
			<Loading loading={contentTypeLoading} text='Loading content type...'>
				<FormProvider {...formMethods}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="u-margin-bottom">
							<TextField name='name' label='Name' />
						</div>
						<RenderFields fieldPrefix='fields.' fields={contentType?.fields || []} />
						<Button htmlType={HTMLButtonTypes.SUBMIT}>Save</Button>
					</form>
				</FormProvider>
			</Loading>
		</div>
		</>
	);
};
