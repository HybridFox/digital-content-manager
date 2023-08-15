import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface IContentTypeFieldStoreState {
	contentTypeFields: any[];
}

export const useContentTypeFieldStore = create<IContentTypeFieldStoreState>()(
	devtools(
		(set) => ({
			contentTypeFields: [],
			// fetchContentComponents: async (options) => {
			// 	const { selectedSiteId } = useAuthStore.getState();
			// 	const [result, error] = await wrapApi(
			// 		kyInstance
			// 			.get(
			// 				`/admin-api/v1/sites/${selectedSiteId}/content-components`,
			// 				{
			// 					searchParams: {
			// 						...options,
			// 					},
			// 				}
			// 			)
			// 			.json<IContentComponentsResponse>()
			// 	);

			// 	if (error) {
			// 		return set(() => ({ contentComponents: [] }));
			// 	}

			// 	set(() => ({ contentComponents: result._embedded.contentComponents }));
			// },
		}),
		{ name: 'contentComponentStore' }
	)
);
