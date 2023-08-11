import { IField } from "@ibs/shared";
import { ReactNode } from "react";

import { IIAMAction } from "../../stores/iam-action";

export interface IPermissionManagerProps {
	// field: IField;
	// children: (index: number) => ReactNode;
	// fieldPrefix?: string;
	name: string;
	iamActions: IIAMAction[];
}
