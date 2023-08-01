import { ReactNode } from "react";

import { BadgeSizes, BadgeTypes } from "./badge.const";

export interface IBadgeProps {
	children?: ReactNode;
	type?: `${BadgeTypes}`;
	size?: `${BadgeSizes}`;
	className?: string;
}
