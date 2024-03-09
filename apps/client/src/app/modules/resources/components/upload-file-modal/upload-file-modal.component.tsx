import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button, ButtonTypes, HTMLButtonTypes, Modal, ModalFooter } from '~components';

import { IUploadFileModalProps } from './upload-file-modal.types';

import { FileField } from '~forms';


export const UploadFileModal: FC<IUploadFileModalProps> = ({
	onSubmit,
	modalOpen,
	onClose,
	loading,
}: IUploadFileModalProps) => {
	const formMethods = useForm();
	const { handleSubmit } = formMethods;

	return (
		<Modal modalOpen={modalOpen} title="Upload file" onClose={onClose}>
			<FormProvider {...formMethods}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<FileField
						name="file"
						label="File"
					></FileField>
					<ModalFooter>
						<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>{loading && <i className="las la-redo-alt la-spin"></i>} Upload</Button>
					</ModalFooter>
				</form>
			</FormProvider>
		</Modal>
	);
};
