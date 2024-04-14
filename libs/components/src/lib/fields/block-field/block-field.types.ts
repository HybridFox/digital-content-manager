import { IGenericFieldProps } from "../fields.types";

export type IBlockFieldProps = IGenericFieldProps

export interface IBlock {
	fields: unknown;
	contentComponentId: string;
	contentComponentName: string
}
