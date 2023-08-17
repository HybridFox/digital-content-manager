import { ReactNode } from "react";

export interface ITab {
	id: string;
	onClick: (tabId: string) => void;
	label: ReactNode;
	disabled?: boolean;
}

export interface ITabsProps {
	tabs: ITab[];
	selectedTabId: string;
}
