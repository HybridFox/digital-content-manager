import { ReactNode } from "react";

export interface IPaginationProps {
	number?: number;
	size?: number;
	totalPages?: number;
	className?: string;
	onPageChange: (page: number) => void;
	onPagesizeChange?: (page: number) => void;
}

export interface IModalFooterProps {
	children: ReactNode;
}
