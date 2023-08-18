import { getPageParams, getPaginationProps } from '@ibs/shared';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Loading, Pagination, Table } from '@ibs/components';
import { useTranslation } from 'react-i18next';

import { useUserStore } from '../../stores/user';
import { useSiteStore } from '../../../sites/stores/site';
import { SelectRolesModal } from '../../components';
import { useSiteUserStore } from '../../../site-users/stores/site-user';

import { USER_SITES_COLUMNS } from './user-detail-sites.const';

export const UserDetailSitesPage = () => {
	const { t } = useTranslation();
	const [modalOpen, setModalOpen] = useState(false);
	const [modalSiteId, setModalSiteId] = useState('');
	const [searchParams, setSearchParams] = useSearchParams();
	const [updateUserLoading, updateUser] = useSiteUserStore((state) => [state.updateUserLoading, state.updateUser]);
	const [userSites, userSitesPagination, userSitesLoading, fetchUserSites] = useUserStore((state) => [
		state.userSites,
		state.userSitesPagination,
		state.userSitesLoading,
		state.fetchUserSites,
	]);
	const [sites, sitesLoading, fetchSites] = useSiteStore((state) => [state.sites, state.sitesLoading, state.fetchSites]);
	const { userId } = useParams();

	useEffect(() => {
		fetchUserSites(userId!, { pagesize: -1 });
	}, []);

	useEffect(() => {
		fetchSites({ ...getPageParams(searchParams) });
	}, [searchParams])

	const handleSelectRoles = (siteId: string) => {
		setModalSiteId(siteId);
		setModalOpen(true);
	};

	const handleModalSubmit = (values: { roles: string[] }) => {
		updateUser(modalSiteId, userId!, values).then(() => {
			setModalOpen(false);
			fetchUserSites(userId!, { pagesize: -1 });
		});
	};

	const handleRemoveRoles = (siteId: string) => {
		updateUser(siteId, userId!, {
			roles: [],
		}).then(() => {
			fetchUserSites(userId!, { pagesize: -1 });
		});
	};

	return (
		<Loading loading={userSitesLoading || sitesLoading} text="Loading data...">
			<Table columns={USER_SITES_COLUMNS(t, userSites, handleRemoveRoles, handleSelectRoles)} rows={sites || []}></Table>
			<Pagination
				className="u-margin-top"
				totalPages={userSitesPagination?.totalPages}
				number={userSitesPagination?.number}
				size={userSitesPagination?.size}
				{...getPaginationProps(searchParams, setSearchParams)}
			/>
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
