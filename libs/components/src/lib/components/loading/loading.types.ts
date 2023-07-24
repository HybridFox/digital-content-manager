import { ReactNode } from "react";

export interface ILoadingProps {
	className?: string;
	text?: string;
	children?: ReactNode;
	loading?: boolean;
}
