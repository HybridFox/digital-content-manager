// @ts-expect-error reasons
import { __federation_method_setRemote, __federation_method_getRemote } from 'virtual:__federation__';

export const importRemote = async (name: string): Promise<void> => {
	__federation_method_setRemote(name, {
		url: () => Promise.resolve(`/modules/${name}/dist/${name}.js`),
		format: 'esm',
		from: 'vite'
	});

	__federation_method_getRemote(name, 'entry')
};
