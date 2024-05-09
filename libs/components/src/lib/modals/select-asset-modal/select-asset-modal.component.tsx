import { FC, useEffect, useState } from 'react';

import { Button, IResourceExplorerSelection, Modal, ModalFooter, ResourceExplorer, ResourceExplorerAction } from '~components';

import { ISelectAssetModalProps } from './select-asset-modal.types';


export const SelectAssetModal: FC<ISelectAssetModalProps> = ({
	onSubmit,
	modalOpen,
	onClose,
	min = 1,
	max = 1,
	defaultSelection,
	siteId,
}: ISelectAssetModalProps) => {
	const [selection, setSelection] = useState<IResourceExplorerSelection[]>([]);
	const [configuration, setConfiguration] = useState<{ repositoryId?: string; path: string }>({ path: '' });

	useEffect(() => {
		if (defaultSelection) {
			setSelection(Array.isArray(defaultSelection) ? defaultSelection : [defaultSelection]);
		}
	}, [defaultSelection]);

	const handleSubmit = () => {
		if (min === 1 && max === 1) {
			return onSubmit(selection[0]);
		}

		return onSubmit(selection);
	};

	return (
		<Modal modalOpen={modalOpen} title="Select asset(s)" onClose={onClose} size="lg">
			<ResourceExplorer
				siteId={siteId}
				selection={selection}
				actions={[ResourceExplorerAction.SELECT, ResourceExplorerAction.VIEW]}
				onChangeConfiguration={(repositoryId, path) => setConfiguration({ repositoryId, path })}
				path={configuration.path}
				repositoryId={configuration.repositoryId}
				onSelection={(selection) => setSelection(selection)}
				minSelection={min}
				maxSelection={max}
			/>
			<ModalFooter>
				<Button onClick={handleSubmit} disabled={selection.length < min || selection.length > max}>
					Select ({selection.length}/{max})
				</Button>
			</ModalFooter>
		</Modal>
	);
};
