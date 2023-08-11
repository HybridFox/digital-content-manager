import { ReactNode } from "react";

import { HTMLButtonTypes, ButtonTypes, ButtonSizes } from "./button.const";

export interface IButtonProps {
	children: ReactNode
	htmlType?: `${HTMLButtonTypes}`
	type?: `${ButtonTypes}`;
	size?: `${ButtonSizes}`;
	className?: string;
	onClick?: () => void;
	block?: boolean;
	title?: string;
	disabled?: boolean;
	active?: boolean;
	id?: string;
}
