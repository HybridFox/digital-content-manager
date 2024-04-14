import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button, ButtonTypes, HTMLButtonTypes, Modal, ModalFooter } from '~components';
import { TextField } from '~components';

import { ICreateDirectoryModalProps } from './create-directory-modal.types';


export const CreateDirectoryModal: FC<ICreateDirectoryModalProps> = ({ onSubmit, modalOpen, onClose, loading }: ICreateDirectoryModalProps) => {
	const formMethods = useForm();
	const { handleSubmit } = formMethods;

	return (
		<Modal modalOpen={modalOpen} title="Create directory" onClose={onClose}>
			<FormProvider {...formMethods}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<TextField name="name" label="Directory Name"></TextField>
					<ModalFooter>
						<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
							{loading && <i className="las la-redo-alt la-spin"></i>} Create
						</Button>
					</ModalFooter>
				</form>
			</FormProvider>
		</Modal>
	);
};
