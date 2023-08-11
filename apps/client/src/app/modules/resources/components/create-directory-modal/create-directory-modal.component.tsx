import { FC } from 'react';
import { Button, HTMLButtonTypes, Modal, ModalFooter } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { TextField } from '@ibs/forms';

import { ICreateDirectoryModalProps } from './create-directory-modal.types';

export const CreateDirectoryModal: FC<ICreateDirectoryModalProps> = ({
	onSubmit,
	modalOpen,
	onClose,
}: ICreateDirectoryModalProps) => {
	const formMethods = useForm();
	const { handleSubmit } = formMethods;

	return (
		<Modal modalOpen={modalOpen} title="Select language" onClose={onClose}>
			<FormProvider {...formMethods}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<TextField
						name="name"
						label="Directory Name"
					></TextField>
					<ModalFooter>
						<Button htmlType={HTMLButtonTypes.SUBMIT}>Create</Button>
					</ModalFooter>
				</form>
			</FormProvider>
		</Modal>
	);
};
