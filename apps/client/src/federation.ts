import React from 'react';

interface Container {
	init(shareScope: string): void;

	get(module: string): () => any;
}

declare const __webpack_init_sharing__: (shareScope: string) => Promise<void>;
declare const __webpack_share_scopes__: { default: string };

// function loadModule(url: string) {
// 	try {
// 		return import(/* webpackIgnore:true */ url);
// 	} catch (e) {
// 		console.error(e);
// 	}

// 	return null;
// }

export interface LoadRemoteFileOptions {
	remoteEntry: string;
	remoteName: string;
	exposedFile: string;
}

export class MfeUtil {
	// holds list of loaded script
	private fileMap: Record<string, boolean> = {};

	findExposedModule = async <T>(uniqueName: string, exposedFile: string): Promise<T | undefined> => {
		// Initializes the shared scope. Fills it with known provided modules from this build and all remotes
		await __webpack_init_sharing__('default');
		console.log(uniqueName)
		const container: Container = (window as any)[uniqueName]; // or get the container somewhere else
		// Initialize the container, it may provide shared modules
		await container.init(__webpack_share_scopes__.default);
		const factory = await container.get(exposedFile);
		return factory();
	};

	public loadRemoteFile = async (loadRemoteModuleOptions: LoadRemoteFileOptions): Promise<any> => {
		await this.loadRemoteEntry(loadRemoteModuleOptions.remoteEntry);
		return await this.findExposedModule<any>(loadRemoteModuleOptions.remoteName, loadRemoteModuleOptions.exposedFile);
	};

	private loadRemoteEntry = async (remoteEntry: string): Promise<void> => {
		return new Promise<void>((resolve, reject) => {
			if (this.fileMap[remoteEntry]) {
				resolve();
				return;
			}

			const script = document.createElement('script');
			script.src = remoteEntry;

			script.onerror = (error: string | Event) => {
				console.error(error, 'unable to load remote entry');
				reject();
			};

			script.onload = () => {
				this.fileMap[remoteEntry] = true;
				resolve(); // window is the global namespace
			};

			document.body.append(script);
		});
	};
}

// export function loadComponent(remoteUrl: string, scope: string, module: string) {
// 	return async () => {
// 		// eslint-disable-next-line no-undef
// 		await __webpack_init_sharing__('default');
// 		const container: Container = await loadModule(remoteUrl);
// 		console.log(container);
// 		// eslint-disable-next-line no-undef
// 		await container.init(__webpack_share_scopes__.default);
// 		const factory = await container.get(module);
// 		const Module = factory();
// 		return Module;
// 	};
// }

// const componentCache = new Map();
// Hook to cache downloaded component and which encapsulates the logic to load
// module dynamically
// export const useFederatedComponent = (remoteUrl: string, scope: any, module: string) => {
// 	const key = `${remoteUrl}-${scope}-${module}`;
// 	const [Component, setComponent] = React.useState<any>(null);

// 	React.useEffect(() => {
// 		if (Component) setComponent(null);
// 		// Only recalculate when key changes
// 	}, [key]);

// 	React.useEffect(() => {
// 		if (!Component) {
// 			const Comp = React.lazy(loadComponent(remoteUrl, scope, module));
// 			componentCache.set(key, Comp);
// 			setComponent(Comp);
// 		}
// 		// key includes all dependencies (scope/module)
// 	}, [Component, key]);

// 	return { Component };
// };
