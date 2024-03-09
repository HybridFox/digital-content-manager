export interface IUploadFileModalProps {
	onSubmit: (values: any) => void;
	modalOpen: boolean;
	onClose: () => void;
	loading: boolean;
}
