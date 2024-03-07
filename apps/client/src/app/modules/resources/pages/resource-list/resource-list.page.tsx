import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';

import { Button, ButtonTypes, Header, ResourceExplorer, ResourceExplorerAction } from '~components';

import { useResourceStore } from '../../stores/resource';
import { CreateDirectoryModal } from '../../components/create-directory-modal/create-directory-modal.component';
import { UploadFileModal } from '../../components/upload-file-modal/upload-file-modal.component';

import { useHeaderStore } from '~shared';

export const ResourceListPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [createDirectoryModalOpen, setCreateDirectoryModalOpen] = useState(false);
	const [uploadFileModalOpen, setUploadFileModalOpen] = useState(false);
	const [createDirectoryLoading, createDirectory] = useResourceStore((state) => [state.createDirectoryLoading, state.createDirectory]);
	const [uploadFileLoading, uploadFile] = useResourceStore((state) => [state.uploadFileLoading, state.uploadFile]);
	const { t } = useTranslation();
	const { siteId } = useParams();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);

	useEffect(() => {
		setBreadcrumbs([]);
	}, [])

	const path = useMemo(() => {
		return searchParams.get('path') || '';
	}, [searchParams]);

	const repositoryId = useMemo(() => {
		return searchParams.get('repositoryId') || '';
	}, [searchParams]);

	const handleCreateDirectory = async (values: { name: string }) => {
		if (!repositoryId) {
			return;
		}

		await createDirectory(siteId!, repositoryId, path, values.name);
		setCreateDirectoryModalOpen(false);
	};

	const handleUploadFile = async (values: { file: File[] }) => {
		if (!repositoryId) {
			return;
		}

		await uploadFile(siteId!, repositoryId, path, values.file[0]);
		setUploadFileModalOpen(false);
	};

	const setConfiguration = (newRepositoryId: string, newPath: string) => {
		setSearchParams({ path: newPath, repositoryId: newRepositoryId });
	};

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t(`RESOURCES.TITLES.LIST`)}
				action={
					<>
						<Button onClick={() => setUploadFileModalOpen(true)}>
							<span className="las la-plus"></span> {t(`RESOURCES.ACTIONS.UPLOAD_FILE`)}
						</Button>
						<Button className="u-margin-left-xs" type={ButtonTypes.OUTLINE} onClick={() => setCreateDirectoryModalOpen(true)}>
							<span className="las la-plus"></span> {t(`RESOURCES.ACTIONS.CREATE_FOLDER`)}
						</Button>
					</>
				}
			></Header>
			<ResourceExplorer
				siteId={siteId!}
				actions={[ResourceExplorerAction.EDIT, ResourceExplorerAction.REMOVE, ResourceExplorerAction.VIEW]}
				onChangeConfiguration={setConfiguration}
				repositoryId={repositoryId}
				path={path}
			/>
			<CreateDirectoryModal
				onSubmit={handleCreateDirectory}
				modalOpen={createDirectoryModalOpen}
				onClose={() => setCreateDirectoryModalOpen(false)}
			/>
			<UploadFileModal onSubmit={handleUploadFile} modalOpen={uploadFileModalOpen} onClose={() => setUploadFileModalOpen(false)} />
		</>
	);
};
