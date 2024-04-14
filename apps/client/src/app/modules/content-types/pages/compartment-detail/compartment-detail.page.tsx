import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
	Alert,
	AlertTypes,
	Button,
	ButtonTypes,
	HTMLButtonTypes,
	Header,
	Loading,
} from '~components';
import { TextField } from '~components';

import { CONTENT_TYPES_PATHS } from '../../content-types.routes';

import { editCompartmentSchema } from './compartment-detail.const';

import {
	CONTENT_TYPE_KINDS_TRANSLATIONS,
	IAPIError,
	useCompartmentStore,
	useContentTypeStore,
	useHeaderStore,
} from '~shared';

interface IEditCompartmentForm {
	name: string;
}

export const CompartmentDetailPage = () => {
	const { t } = useTranslation();
	const [contentType, contentTypeLoading, fetchContentType] =
		useContentTypeStore((state) => [
			state.contentType,
			state.contentTypeLoading,
			state.fetchContentType,
		]);
	const [compartment, compartmentLoading, fetchCompartment] =
		useCompartmentStore((state) => [
			state.compartment,
			state.compartmentLoading,
			state.fetchCompartment,
		]);
	const [updateCompartment, updateCompartmentLoading] = useCompartmentStore(
		(state) => [state.updateCompartment, state.updateCompartmentLoading]
	);
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const { siteId, contentTypeId, compartmentId } = useParams();
	const navigate = useNavigate();
	const formMethods = useForm<IEditCompartmentForm>({
		resolver: yupResolver(editCompartmentSchema),
		values: compartment,
	});

	const {
		handleSubmit,
		setError,
		formState: { errors }
	} = formMethods;

	useEffect(() => {
		if (!contentTypeId || !compartmentId) {
			return navigate('/not-found');
		}

		fetchCompartment(siteId!, contentTypeId, compartmentId);
		fetchContentType(siteId!, contentTypeId);
	}, []);

	useEffect(() => {
		setBreadcrumbs([
			{ label: t('BREADCRUMBS.CONTENT_TYPES'), to: generatePath(CONTENT_TYPES_PATHS.ROOT, { siteId }) },
			{
				label: contentType?.name,
				badge: contentType && CONTENT_TYPE_KINDS_TRANSLATIONS[contentType.kind],
				to: generatePath(CONTENT_TYPES_PATHS.DETAIL, {
					contentTypeId: contentType?.id || '',
					siteId
				}),
			},
			{
				label: 'Compartments',
			},
			{
				label: compartment?.name
			}
		]);
	}, [compartment, contentType])

	const onSubmit = (values: IEditCompartmentForm) => {
		if (!contentType || !compartment) {
			return;
		}

		updateCompartment(siteId!, contentType.id, compartment?.id, values).catch(
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
						Editing compartment <i>"{compartment?.name || '...'}"</i>
					</>
				}
				breadcrumbs={breadcrumbs}
			></Header>
			<Loading
				text="Compartment details loading..."
				loading={contentTypeLoading || compartmentLoading}
			>
				<FormProvider {...formMethods}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<Alert
							className="u-margin-bottom"
							type={AlertTypes.DANGER}
						>
							{errors?.root?.message}
						</Alert>
						<TextField name="name" label='Compartment name' />
						<div className="u-margin-top">
							<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
								{updateCompartmentLoading && (
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
