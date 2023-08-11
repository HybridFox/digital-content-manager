export interface IExplorerPathProps {
	className?: string;
	path: string[];
	onNavigate: (path: string) => void
}
