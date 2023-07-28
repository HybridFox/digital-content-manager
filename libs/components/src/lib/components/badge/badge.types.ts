import { ReactNode } from "react";

import { BadgeTypes } from "./badge.const";

export interface IBadgeProps {
	children?: ReactNode;
	type?: `${BadgeTypes}`;
	className?: string;
}
