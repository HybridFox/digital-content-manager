export interface ICreateDirectoryModalProps {
	onSubmit: (values: any) => void;
	modalOpen: boolean;
	onClose: () => void;
	loading: boolean;
}
