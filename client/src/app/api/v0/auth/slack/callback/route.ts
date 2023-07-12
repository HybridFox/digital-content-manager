import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
	const fetchCall = await fetch(`${process.env.API_BASEURL}/auth/slack/callback?${new URLSearchParams({
		code: req.nextUrl.searchParams.get('code')!,
		state: req.nextUrl.searchParams.get('state')!
	})}`);
	const json: any = await fetchCall.json();

    const response = NextResponse.redirect(new URL('/', req.url));

	// TODO: Set expire
	response.cookies.set('token', json.token, {
		path: '/',
		httpOnly: true
	})
	
	return response;
}
