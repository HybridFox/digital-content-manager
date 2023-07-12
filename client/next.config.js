/** @type {import('next').NextConfig} */
const nextConfig = () => {
	const rewrites = () => {
		return [
			{
				source: '/api/:path*',
				destination: 'https://api.socialcanvas-o.ibs.sh/api/:path*',
			},
		];
	};
	return {
		rewrites,
	};
};

module.exports = nextConfig;
