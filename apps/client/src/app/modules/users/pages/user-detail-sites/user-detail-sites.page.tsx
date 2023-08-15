import { IAPIError, useHeaderStore, useRoleStore } from '@ibs/shared';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, AlertTypes, Button, HTMLButtonTypes, Header, Loading, Table } from '@ibs/components';
import { Trans, useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CheckboxField, TextField, TextFieldTypes } from '@ibs/forms';

import { useUserStore } from '../../stores/user';
import { USER_PATHS } from '../../users.routes';
import { useSiteStore } from '../../../sites/stores/site';
import { SelectRolesModal } from '../../components';
import { useSiteUserStore } from '../../../site-users/stores/site-user';

import { USER_SITES_COLUMNS } from './user-detail-sites.const';

interface EditUserForm {
	roles: string[];
}

export const UserDetailSitesPage = () => {
	const { t } = useTranslation();
	const [modalOpen, setModalOpen] = useState(false);
	const [modalSiteId, setModalSiteId] = useState('');

	const [user] = useUserStore((state) => [state.user]);
	const [updateUserLoading, updateUser] = useSiteUserStore((state) => [state.updateUserLoading, state.updateUser]);
	const [userSites, userSitesLoading, fetchUserSites] = useUserStore((state) => [state.userSites, state.userSitesLoading, state.fetchUserSites]);
	const [sites, sitesLoading, fetchSites] = useSiteStore((state) => [state.sites, state.sitesLoading, state.fetchSites]);
	const { userId } = useParams();

	useEffect(() => {
		fetchUserSites(userId!, { pagesize: -1 });
		fetchSites();
	}, []);

	const handleSelectRoles = (siteId: string) => {
		setModalSiteId(siteId);
		setModalOpen(true);
	};

	const handleModalSubmit = (values: { roles: string[] }) => {
		updateUser(modalSiteId, userId!, values)
			.then(() => {
				setModalOpen(false);
				fetchUserSites(userId!, { pagesize: -1 });
			});
	};

	const handleRemoveRoles = (siteId: string) => {
		updateUser(siteId, userId!, {
			roles: []
		})
			.then(() => {
				fetchUserSites(userId!, { pagesize: -1 });
			});
	};

	// const onSubmit = (values: EditUserForm) => {
	// 	if (!userId) {
	// 		return;
	// 	}

	// 	updateUser(userId, values).catch((error: IAPIError) => {
	// 		setError('root', {
	// 			message: error.code,
	// 		});
	// 	});
	// };

	return (
		<Loading loading={userSitesLoading || sitesLoading} text="Loading data...">
			<Table columns={USER_SITES_COLUMNS(t, userSites, handleRemoveRoles, handleSelectRoles)} rows={sites || []}></Table>
			<SelectRolesModal
				modalOpen={modalOpen}
				siteId={modalSiteId}
				updateLoading={updateUserLoading}
				onClose={() => setModalOpen(false)}
				onSubmit={(values) => handleModalSubmit(values)}
			/>
		</Loading>
	);
};
