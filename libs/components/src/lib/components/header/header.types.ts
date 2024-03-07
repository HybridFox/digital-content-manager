import { ReactNode } from "react";

import { IHeaderBreadcrumb } from "~shared";

export interface IHeaderTab {
	to: string;
	label: ReactNode;
	disabled?: boolean;
}

export interface IHeaderProps {
	title: ReactNode;
	action?: ReactNode;
	className?: string;
	tabs?: IHeaderTab[];
	breadcrumbs?: IHeaderBreadcrumb[];
	metaInfo?: string;
	subText?: ReactNode;
}
