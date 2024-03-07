import { IIAMAction } from "~shared";

export interface IPermissionManagerProps {
	// field: IField;
	// children: (index: number) => ReactNode;
	// fieldPrefix?: string;
	name: string;
	iamActions: IIAMAction[];
}
