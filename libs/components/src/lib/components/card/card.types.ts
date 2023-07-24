import { ReactNode } from "react";

import { CardTypes } from "./card.const";

export interface ICardProps {
	children?: ReactNode;
	type?: `${CardTypes}`;
	className?: string;
	title?: string;
}
