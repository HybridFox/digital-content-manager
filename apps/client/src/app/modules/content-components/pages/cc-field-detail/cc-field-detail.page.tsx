import { useEffect } from 'react';
import {
	IAPIError,
	useContentComponentFieldStore,
	useContentComponentStore,
	useHeaderStore,
} from '@ibs/shared';
import {
	Alert,
	AlertTypes,
	Button,
	ButtonTypes,
	HTMLButtonTypes,
	Header,
	Loading,
} from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { FIELD_DETAIL_TABS, editFieldSchema } from './cc-field-detail.const';

interface IEditFieldForm {
	name: string;
	config: Record<string, unknown>;
	min: number;
	max: number;
	multiLanguage: boolean;
}

export const CCFieldDetailPage = () => {
	const [contentComponent, contentComponentLoading, fetchContentComponent] =
		useContentComponentStore((state) => [
			state.contentComponent,
			state.contentComponentLoading,
			state.fetchContentComponent,
		]);
	const [contentComponentField, contentComponentFieldLoading, fetchContentComponentField] =
		useContentComponentFieldStore((state) => [
			state.field,
			state.fieldLoading,
			state.fetchField,
		]);
	const [updateField, updateFieldLoading] = useContentComponentFieldStore(
		(state) => [state.updateField, state.updateFieldLoading]
	);
	const [breadcrumbs] = useHeaderStore((state) => [state.breadcrumbs]);
	const { contentComponentId, siteId, fieldId } = useParams();
	const navigate = useNavigate();
	const formMethods = useForm<IEditFieldForm>({
		resolver: yupResolver(editFieldSchema),
		values: contentComponentField,
	});

	const {
		handleSubmit,
		setError,
		formState: { errors }
	} = formMethods;

	useEffect(() => {
		if (!contentComponentId || !fieldId) {
			return navigate('/not-found');
		}

		fetchContentComponentField(siteId!, contentComponentId, fieldId);
		fetchContentComponent(siteId!, contentComponentId);
	}, []);

	const onSubmit = (values: IEditFieldForm) => {
		if (!contentComponent || !contentComponentField) {
			return;
		}

		updateField(siteId!, contentComponent.id, contentComponentField?.id, values).catch(
			(error: IAPIError) => {
				setError('root', {
					message: error.code,
				});
			}
		);
	};

	return (
		<>
			<Header
				title={
					<>
						Editing field <i>"{contentComponentField?.name || '...'}"</i>
					</>
				}
				tabs={FIELD_DETAIL_TABS(siteId!, contentComponent, contentComponentField)}
				breadcrumbs={breadcrumbs}
			></Header>
			<Loading
				text="Content type loading..."
				loading={contentComponentLoading || contentComponentFieldLoading}
			>
				<FormProvider {...formMethods}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<Alert
							className="u-margin-bottom"
							type={AlertTypes.DANGER}
						>
							{errors?.root?.message}
						</Alert>
						<Outlet />
						<div className="u-margin-top">
							<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
								{updateFieldLoading && (
									<i className="las la-redo-alt la-spin"></i>
								)}{' '}
								Save
							</Button>
						</div>
					</form>
				</FormProvider>
			</Loading>
		</>
	);
};
