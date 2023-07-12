import { redirect } from 'next/navigation';
import { AUTH_PATHS } from '~/app/(auth)/_auth.const';

export default function Home() {
	redirect(AUTH_PATHS.login);
}
