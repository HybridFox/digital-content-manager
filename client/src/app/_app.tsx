import type { AppProps } from 'next/app';

const customApp = ({ Component, pageProps }: AppProps) => {
	return <Component {...pageProps} />;
};

export default customApp;
