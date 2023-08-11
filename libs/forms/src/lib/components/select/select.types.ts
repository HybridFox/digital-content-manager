import { Options } from "react-select";

export interface ISelectOptions {
	label: string;
	value: string;
	onClick?: () => void;
}

export interface ISelectProps {
	placeholder?: string;
	options: Options<any>;
	value?: any;
	onChange?: (value: string | null) => void;
	className?: string;
	closeMenuOnSelect?: boolean;
	disabled?: boolean;
	hasError?: boolean;
}
