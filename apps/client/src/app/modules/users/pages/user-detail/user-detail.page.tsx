import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

import { Header, Loading } from '~components';

import { useUserStore } from '../../stores/user';
import { USER_PATHS } from '../../users.routes';

import { USER_DETAIL_TABS } from './user-detail.const';

import { useHeaderStore } from '~shared';

export const UserDetailPage = () => {
	const { t } = useTranslation();

	const [user, userLoading, fetchUser] = useUserStore((state) => [
		state.user,
		state.userLoading,
		state.fetchUser,
	]);
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const { userId } = useParams();

	useEffect(() => {
		setBreadcrumbs([{ label: t(`BREADCRUMBS.USERS`), to: USER_PATHS.ROOT }, { label: t(`BREADCRUMBS.EDIT`) }]);
	}, [user]);

	useEffect(() => {
		if (!userId) {
			return;
		}

		fetchUser(userId);
	}, [userId]);

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={
					<Trans t={t} i18nKey="USERS.TITLES.EDIT" values={{ userName: user?.name || '...' }} />
				}
				tabs={USER_DETAIL_TABS(t, userId!)}
			></Header>
			<div className="u-margin-top">
				<Loading loading={userLoading} text="Loading data...">
					<Outlet />
				</Loading>
			</div>
		</>
	);
};
