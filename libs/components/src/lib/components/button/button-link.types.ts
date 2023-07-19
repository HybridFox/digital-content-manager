import { ReactNode } from "react";

import { ButtonTypes } from "./button.const";

export interface IButtonLinkProps {
	children: ReactNode
	type?: `${ButtonTypes}`;
	className?: string;
	to: string;
}
