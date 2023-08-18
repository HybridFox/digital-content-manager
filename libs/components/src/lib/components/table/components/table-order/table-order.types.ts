export interface ITableOrderProps {
	onOrder: (currentIndex: number, newIndex: number) => void;
	currentIndex: number;
	totalRows: number;
}

