import { IStorageRepository } from "~shared";

export interface IExplorerRepositoriesProps {
	className?: string;
	repositories: IStorageRepository[];
	selectedRepositoryId?: string;
	onSelect: (path: string) => void
}
