import { Badge, Button, ButtonSizes, ButtonTypes, ITableColumn } from "@ibs/components";
import { IWorkflowTransition } from "@ibs/shared";
import { TFunction } from "i18next";

export const WORKFLOW_TRANSITIONS_COLUMNS = (t: TFunction, handleRemove: (workflowTransitionId: string) => void): ITableColumn<IWorkflowTransition>[] => [
	{
		id: 'fromState.name',
		label: 'From State',
		format: (value, key, item) => <>{value} <Badge>{item.fromState.technicalState}</Badge></>
	},
	{
		id: 'accent',
		label: '',
		width: '50px',
		format: () => <span className="las la-angle-right"></span>
	},
	{
		id: 'toState.name',
		label: 'To State',
		format: (value, key, item) => <>{value} <Badge>{item.toState.technicalState}</Badge></>
	},
	{
		id: 'actions',
		label: '',
		width: '75px',
		format: (value, key, item) => (
			<div className="u-display-flex">
				{/* <ButtonLink to={`${item.id}`} size={ButtonSizes.SMALL} type={ButtonTypes.SECONDARY} className="u-margin-left-auto">
					<i className="las la-pen"></i> {t(`GENERAL.LABELS.EDIT`)}
				</ButtonLink> */}
				<Button size={ButtonSizes.SMALL} type={ButtonTypes.SECONDARY} className="u-margin-left-sm" onClick={() => handleRemove(item.id)}>
					<i className="las la-trash"></i>
				</Button>
			</div>
		),
	},
];
