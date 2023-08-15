import { ReactNode } from "react";

export interface IPermissionProp {
	className?: string;
	resource: string;
	action: string;
	children: ReactNode;
	siteId?: string;
}
