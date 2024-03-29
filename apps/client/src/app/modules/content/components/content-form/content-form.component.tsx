import { FC, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import cx from 'classnames/bind';
import slugify from 'slugify';
import { clone } from 'rambda';

import { Alert, AlertTypes, Button, ButtonTypes, Card, CardFooter, CardMeta, HTMLButtonTypes, RenderFields } from '~components';

import styles from './content-form.module.scss';
import { ContentFormMode, IContentFormProps } from './content-form.types';

import { RadioField, TextField } from '~forms';
import { IContentItem, WorkflowTechnicalStates } from '~shared';

const cxBind = cx.bind(styles);

export const ContentForm: FC<IContentFormProps> = ({ onSubmit, mode, contentItem, loading, workflow, workflowStates, fields }) => {
	const { siteId } = useParams();
	const formMethods = useForm<IContentItem>({
		// resolver: yupResolver(generateValidationSchema(fields)),
		values: clone(contentItem),
		// mode: 'onChange',
	});

	const {
		handleSubmit,
		formState: { errors },
		watch,
		setValue
	} = formMethods;

	const workflowStateId = watch('workflowStateId');
	const name = watch('name');

	useEffect(() => {
		if (mode !== ContentFormMode.CREATE) {
			return;
		}
		
		setValue('slug', slugify((name || '').toLowerCase()))
	}, [name])

	const technicalState = useMemo(() => {
		return (workflowStates || []).find((state) => state.id === workflowStateId)?.technicalState;
	}, [workflowStateId, workflowStates]);

	const statusOptions = useMemo(() => {
		return (workflow?.transitions || [])
			.filter((transition) => (contentItem?.published ? true : transition.toState.technicalState !== WorkflowTechnicalStates.UNPUBLISHED))
			.filter((transition) => transition.fromState.id === contentItem?.workflowStateId)
			.sort((a, b) => (a.fromState.name < b.fromState.name ? -1 : 1))
			.map((transition) => ({
				label: transition.toState.name,
				value: transition.toState.id,
			}));
	}, [workflow, contentItem]);

	return (
		<FormProvider {...formMethods}>
			<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>
				{errors?.root?.message}
			</Alert>
			<form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%' }}>
				{mode === ContentFormMode.CREATE && (
					<Card className='u-margin-bottom' title='Metadata'>
						<div className="u-row">
							<div className="u-col-md-8">
								<TextField name="name" label="Administrative Name" />
							</div>
							<div className="u-col-md-4">
								<TextField name="slug" label="Slug" />
							</div>
						</div>
					</Card>
				)}
				<div className={cxBind('p-content-detail')}>
					<div className={cxBind('p-content-detail__fields')}>
						<RenderFields
							siteId={siteId!}
							fieldPrefix="fields."
							fields={fields}
						/>
					</div>
					{mode === ContentFormMode.EDIT && (
						<div className={cxBind('p-content-detail__status')}>
							<Card className="u-margin-bottom">
								<CardMeta
									items={[
										{
											label: 'Item Online',
											value: contentItem?.published ? (
												<span className="las la-check u-text--success"></span>
											) : (
												<span className="las la-times u-text--danger"></span>
											),
										},
										{ label: 'Revision status', value: contentItem?.currentWorkflowState?.name },
										{
											label: (
												<RadioField
													label="New status"
													name="workflowStateId"
													fieldConfiguration={{ options: statusOptions }}
												></RadioField>
											),
										},
									]}
								/>
								<CardFooter>
									<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT} block>
										{loading && <i className="las la-redo-alt la-spin"></i>}{' '}
										{technicalState === WorkflowTechnicalStates.PUBLISHED && 'Publish'}
										{technicalState === WorkflowTechnicalStates.UNPUBLISHED && 'Unpublish'}
										{technicalState === WorkflowTechnicalStates.DRAFT && 'Save draft'}
									</Button>
								</CardFooter>
							</Card>
						</div>
					)}
					{mode === ContentFormMode.CREATE && (
						<div className={cxBind('p-content-detail__status')}>
							<Card className="u-margin-bottom">
								<CardMeta
									items={[
										{
											label: 'Item Online',
											value: <span className="las la-times u-text--danger"></span>,
										},
										{ label: 'Revision status', value: workflowStates?.find((state) => state.id === workflow?.defaultWorkflowStateId)?.name }
									]}
								/>
								<CardFooter>
									<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
										{loading && <i className="las la-redo-alt la-spin"></i>} Create item
									</Button>
								</CardFooter>
							</Card>
						</div>
					)}
				</div>
			</form>
		</FormProvider>
	);
};
