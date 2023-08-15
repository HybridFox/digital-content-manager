import { FC } from 'react';
import { Button, ButtonTypes, HTMLButtonTypes, Modal, ModalFooter } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { FileField } from '@ibs/forms';

import { IUploadFileModalProps } from './upload-file-modal.types';

export const UploadFileModal: FC<IUploadFileModalProps> = ({
	onSubmit,
	modalOpen,
	onClose,
}: IUploadFileModalProps) => {
	const formMethods = useForm();
	const { handleSubmit } = formMethods;

	return (
		<Modal modalOpen={modalOpen} title="Select language" onClose={onClose}>
			<FormProvider {...formMethods}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<FileField
						name="file"
						label="File"
					></FileField>
					<ModalFooter>
						<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>Upload</Button>
					</ModalFooter>
				</form>
			</FormProvider>
		</Modal>
	);
};
