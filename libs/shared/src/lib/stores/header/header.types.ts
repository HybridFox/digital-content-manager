import { ReactNode } from "react";

export interface IHeaderBreadcrumb {
	to?: string;
	label?: ReactNode;
	disabled?: boolean;
}
