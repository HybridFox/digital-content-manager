import { ReactNode } from "react";

export interface IModalProps {
	title: ReactNode;
	children: ReactNode;
	modalOpen: boolean;
	onClose?: () => void;
	size?: string;
}

export interface IModalFooterProps {
	children: ReactNode;
}
