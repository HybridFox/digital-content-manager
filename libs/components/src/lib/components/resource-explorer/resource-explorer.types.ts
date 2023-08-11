export enum ResourceExplorerAction {
	EDIT = 'EDIT',
	REMOVE = 'REMOVE',
	VIEW = 'VIEW',
	SELECT = 'SELECT'
}

export interface IResourceExplorerSelection {
	path: string;
	storageRepositoryId: string;
}

export interface IResourceExplorerProps {
	onChangeConfiguration: (repositoryId: string, path: string) => void
	repositoryId?: string;
	path: string;
	actions: ResourceExplorerAction[];
	onSelection?: (selection: IResourceExplorerSelection[]) => void;
	selection?: IResourceExplorerSelection[];
	minSelection?: number;
	maxSelection?: number;
}
