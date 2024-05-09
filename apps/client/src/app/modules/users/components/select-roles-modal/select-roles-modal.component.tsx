import { FC, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button, ButtonTypes, HTMLButtonTypes, Loading, Modal, ModalFooter } from '~components';
import { CheckboxField } from '~components';

import { ISelectRolesModalProps } from './select-roles-modal.types';

import { useSiteRoleStore } from '~shared';


export const SelectRolesModal: FC<ISelectRolesModalProps> = ({ onSubmit, modalOpen, onClose, siteId, updateLoading }: ISelectRolesModalProps) => {
	const formMethods = useForm();
	const { handleSubmit } = formMethods;

	const [roles, rolesLoading, fetchRoles] = useSiteRoleStore((state) => [state.roles, state.rolesLoading, state.fetchRoles]);

	useEffect(() => {
		if (!siteId) {
			return;
		}

		fetchRoles(siteId);
	}, [siteId]);

	return (
		<Modal modalOpen={modalOpen} title="Select Roles" onClose={onClose}>
			<Loading loading={rolesLoading}>
				<FormProvider {...formMethods}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<CheckboxField
							name="roles"
							label="Roles"
							fieldConfiguration={{ options: roles.map((role) => ({ label: role.name, value: role.id })) }}
						/>
						<ModalFooter>
							<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
								{updateLoading && <i className="las la-redo-alt la-spin"></i>} Save
							</Button>
						</ModalFooter>
					</form>
				</FormProvider>
			</Loading>
		</Modal>
	);
};
