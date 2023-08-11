import { IStorageRepository } from "@ibs/shared";

export interface IExplorerRepositoriesProps {
	className?: string;
	repositories: IStorageRepository[];
	selectedRepositoryId?: string;
	onSelect: (path: string) => void
}
