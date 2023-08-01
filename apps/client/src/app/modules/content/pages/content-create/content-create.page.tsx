import { useEffect, useState } from 'react';
import { CONTENT_TYPE_KINDS_PARAMETER_MAP, useAuthStore, useContentTypeStore, useHeaderStore } from '@ibs/shared';
import { Button, HTMLButtonTypes, Header, Loading, Modal, ModalFooter, Table } from '@ibs/components';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RadioField } from '@ibs/forms';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { CONTENT_PATHS } from '../../content.routes';

import { CONTENT_CREATE_COLUMNS, selectLanguageSchema } from './content-create.const';

interface ISelectLanguageForm {
	language: string;
}

export const ContentCreatePage = () => {
	const { kind } = useParams();
	const { t } = useTranslation();
	const [contentTypes, contentTypesLoading, fetchContentTypes] = useContentTypeStore((state) => [
		state.contentTypes,
		state.contentTypesLoading,
		state.fetchContentTypes,
	]);
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const [activeSite] = useAuthStore((state) => [state.activeSite]);
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedContentTypeId, setSelectedContentTypeId] = useState('');
	const navigate = useNavigate();
	const formMethods = useForm<ISelectLanguageForm>({
		resolver: yupResolver(selectLanguageSchema)
	});
	const { handleSubmit } = formMethods;

	useEffect(() => {
		if (!kind) {
			return;
		}

		fetchContentTypes({ pagesize: -1, kind: CONTENT_TYPE_KINDS_PARAMETER_MAP[kind] });
		setBreadcrumbs([{ label: t(`BREADCRUMBS.${kind?.toUpperCase()}`), to: CONTENT_PATHS.ROOT }, { label: t(`BREADCRUMBS.CREATE`) }]);
	}, []);

	const onSelectContentType = (contentTypeId: string) => {
		setModalOpen(true);
		setSelectedContentTypeId(contentTypeId);
	};

	const onSubmit = ({ language }: ISelectLanguageForm) => {
		setModalOpen(false);
		navigate(generatePath(CONTENT_PATHS.CREATE_DETAIL, { contentTypeId: selectedContentTypeId, kind }) + `?languageId=${language}`)
	}

	return (
		<>
			<Header breadcrumbs={breadcrumbs} title="Select Content Type"></Header>
			<Loading loading={contentTypesLoading} text="Loading content types...">
				<Table columns={CONTENT_CREATE_COLUMNS(onSelectContentType)} rows={contentTypes}></Table>
			</Loading>
			<Modal modalOpen={modalOpen} title="Select language">
				<FormProvider {...formMethods}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<RadioField
							name="language"
							label="Language"
							fieldConfiguration={{
								options: (activeSite?.languages || []).map((language) => ({
									label: `${language.name} (${language.key.toUpperCase()})`,
									value: language.id,
								})),
							}}
						></RadioField>
						<ModalFooter>
							<Button htmlType={HTMLButtonTypes.SUBMIT}>Create</Button>
						</ModalFooter>
					</form>
				</FormProvider>
			</Modal>
		</>
	);
};
