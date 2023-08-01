import { ReactNode } from "react";

export interface IModalProps {
	title: ReactNode;
	children: ReactNode;
	modalOpen: boolean;
}

export interface IModalFooterProps {
	children: ReactNode;
}
