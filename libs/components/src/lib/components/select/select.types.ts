import { Options } from "react-select";

export interface ISelectOptions {
	label: string;
	value: string;
	options?: ISelectOptions[];
	onClick?: () => void;
}

export interface ISelectProps {
	placeholder?: string;
	options: Options<any>;
	value?: any;
	onChange?: (value: string | null | string[]) => void;
	className?: string;
	closeMenuOnSelect?: boolean;
	disabled?: boolean;
	hasError?: boolean;
	min?: number;
	max?: number;
	isClearable?: boolean;
	loading?: boolean;
}
