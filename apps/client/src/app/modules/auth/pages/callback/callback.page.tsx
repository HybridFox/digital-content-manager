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
					<img src="/assets/img/logo-alternative.svg" alt="Logo" />
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
					backgroundImage: `url(https://source.unsplash.com/random/?fox,animal,nature)`,
				}}
			></div>
		</div>
	);
};
