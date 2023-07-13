import { TextInputTypes } from "./text-input.const";

export interface TextInputProps {
	name: string;
	placeholder?: string;
	label?: string;
	type: `${TextInputTypes}`
}
