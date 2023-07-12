import { InputTypes } from './Input.const';

export type InputProps = {
	type: `${InputTypes}`;
	label?: string;
	placeholder: string;
	labelId?: string;
};
