export interface ISelectRolesModalProps {
	onSubmit: (values: any) => void;
	modalOpen: boolean;
	siteId: string;
	onClose: () => void;
	updateLoading: boolean;
}
