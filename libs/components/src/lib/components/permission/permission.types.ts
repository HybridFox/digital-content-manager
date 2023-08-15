import { ReactNode } from "react";

export interface IPermissionProp {
	className?: string;
	resource: string;
	action: string | string[];
	children: ReactNode;
	siteId?: string;
}
