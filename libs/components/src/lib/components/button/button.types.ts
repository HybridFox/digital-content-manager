import { ReactNode } from "react";

import { HTMLButtonTypes, ButtonTypes } from "./button.const";

export interface IButtonProps {
	children: ReactNode
	htmlType?: `${HTMLButtonTypes}`
	type?: `${ButtonTypes}`;
	className?: string
}
