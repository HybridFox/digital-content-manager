import { ReactNode } from "react";

import { ButtonSizes, ButtonTypes } from "./button.const";

export interface IButtonLinkProps {
	children: ReactNode
	type?: `${ButtonTypes}`;
	size?: `${ButtonSizes}`;
	className?: string;
	to: string;
}
