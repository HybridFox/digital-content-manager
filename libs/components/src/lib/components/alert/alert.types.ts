import { ReactNode } from "react";

import { AlertTypes } from "./alert.const";

export interface IAlertProps {
	children?: ReactNode;
	type?: `${AlertTypes}`;
	className?: string;
	closable?: boolean;
}
