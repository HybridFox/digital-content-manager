import { IResourceExplorerSelection } from "@ibs/components";

export interface ISelectAssetModalProps {
	onSubmit: (values: any) => void;
	modalOpen: boolean;
	onClose: () => void;
	min?: number;
	max?: number;
	defaultSelection?: IResourceExplorerSelection[];
	siteId: string;
}
