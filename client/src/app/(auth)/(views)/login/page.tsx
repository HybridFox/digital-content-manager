'use client';

import { Heading, Button, Input, Icon } from '~/app/_shared/components';
import styles from './page.module.scss';
import cx from 'classnames/bind';
import { AuthVisual } from '~/app/(auth)/_components';
import { BrandIcon } from '~/app/_shared/components/BrandIcon';
export default function Login() {
	const cxBind = cx.bind(styles);
	return (
		<section className={cxBind('p-login', 'u-layout__grid')}>
			<div className={cxBind('p-login__form')}>
				<Heading
					headingType="h1"
					headingStyle="heading-1"
					classNames={cxBind('p-login__form__heading')}
				>
					Oh hi there!
				</Heading>
				<p className={cxBind('p-login__form__description')}>
					Let&apos;s get rolling!
				</p>
				<div className={cxBind('p-login__form__options')}>
					<Button
						classNames={cxBind(
							'p-login__form__options__social-button--google',
						)}
						icon={<BrandIcon icon="google" />}
					>
						Continue with Google
					</Button>
					<Button
						classNames={cxBind(
							'p-login__form__options__social-button--slack',
						)}
						icon={<BrandIcon icon="slack" />}
						onClick={() => window.location.assign('/api/v1/auth/slack/login')}
					>
						Continue with Slack
					</Button>
					<Button
						classNames={cxBind(
							'p-login__form__options__social-button--facebook',
						)}
						icon={<BrandIcon icon="facebook" />}
					>
						Continue with Facebook
					</Button>
					<Input
						label="E-mail"
						type="text"
						placeholder="YOUR EMAIL"
					/>
					<Button>CONTINUE</Button>
				</div>
			</div>
			<div className={cxBind('p-login__visual')}>
				<AuthVisual />
			</div>
		</section>
	);
}
