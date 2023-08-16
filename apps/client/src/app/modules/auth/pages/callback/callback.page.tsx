import { Alert, AlertTypes, ButtonLink, ButtonTypes, Loading } from '@ibs/components';
import cx from 'classnames/bind';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { IAPIError, useAuthStore } from '@ibs/shared';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

import styles from './callback.module.scss';
const cxBind = cx.bind(styles);

export const CallbackPage = () => {
	const [callback] = useAuthStore((state) => [state.callback]);
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const { authenticationMethodId } = useParams();
	const [searchParams] = useSearchParams();
	const { t } = useTranslation();

	useEffect(() => {
		callback(authenticationMethodId!, searchParams.get('code')!)
			.then(() => navigate('/'))
			.catch((error: IAPIError) => setError(t(`API_MESSAGES.${error.code}`)));
	}, []);

	return (
		<div className={cxBind('p-callback')}>
			<div className={cxBind('p-callback__content')}>
				<div className={cxBind('p-callback__logo')}>
					<i className="las la-sms"></i> Inhoud Beheer Systeem
				</div>
				<Loading className={cxBind('p-callback__loading')} loading={!error}></Loading>
				{error && (
					<>
						<Alert closable={false} type={AlertTypes.DANGER} className={cxBind('p-callback__loading')}>
							{error}
						</Alert>
						<div className={cxBind('p-callback__action')}>
							<ButtonLink to="/auth/login" type={ButtonTypes.PRIMARY} block>
								Try Again
							</ButtonLink>
						</div>
					</>
				)}
			</div>
			<div
				className={cxBind('p-callback__aside')}
				style={{
					backgroundImage: `url(https://images.unsplash.com/photo-1563923683738-4ad77b43411c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
				}}
			></div>
		</div>
	);
};
