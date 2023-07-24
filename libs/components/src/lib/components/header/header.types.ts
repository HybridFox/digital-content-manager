import { ReactNode } from "react";


export interface IHeaderProps {
	title: string;
	subTitle: string;
	action?: ReactNode;
	className?: string;
}
