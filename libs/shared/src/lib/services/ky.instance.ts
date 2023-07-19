import ky from "ky";

import { IAPIError } from "../types/error.types";
import { useAuthStore } from "../stores/auth";

export const kyInstance = ky.extend({
	hooks: {
		beforeRequest: [(request) => {
			const token = useAuthStore.getState().token;

			console.log('token', token)
			if (token) {
				request.headers.set('Authorization', `Bearer ${token}`);
			}

			return request;
		}],
		beforeError: [async (error) => {
			const errorBody = await error.response.json();
			return errorBody;
		}]
	}
})

export const kyAuthInstance = ky.extend({
	hooks: {
		beforeError: [async (error) => {
			const errorBody = await error.response.json();
			return errorBody;
		}]
	}
})


export const wrapApi = async <T = unknown, E = IAPIError>(fn: Promise<T>): Promise<[T, null] | [null, E]> => fn
	.then((result) => [result, null] as [T, null])
	.catch((error) => [null, error])