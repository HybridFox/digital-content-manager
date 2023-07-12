import { ReactNode } from 'react';
import { ButtonTypes, IconPosition } from './Button.const';

export type ButtonProps = {
	children: ReactNode;
	onClick?: () => void;
	disabled?: boolean;
	icon?: ReactNode;
	type?: `${ButtonTypes}`;
	iconPosition?: `${IconPosition}`;
	classNames?: string;
};
