import classNames from 'classnames';
import { TFunction } from 'i18next';

import { Button, ButtonSizes, ButtonTypes, ITableColumn } from '~components';

import { IModule, IModuleUpdateDTO } from '~shared';

export const MODULE_LIST_COLUMNS = (
	t: TFunction,
	handleUpdate: (moduleId: string, values: IModuleUpdateDTO) => void,
	updateLoading: boolean,
	handleRemove: (moduleId: string) => void,
	removeLoading: boolean,
): ITableColumn<IModule>[] => [
	{
		id: 'name',
		label: 'Name',
	},
	{
		id: 'active',
		label: 'Active',
		format(value) {
			if (value) {
				return <span className='las la-check u-text--success'></span>
			}

			return <span className='las la-times u-text--danger'></span>;
		},
	},
	{
		id: 'actions',
		label: '',
		format: (value, key, item) => {
			return (
				<div className="u-display-flex u-justify-content-end">
					<Button
						size={ButtonSizes.SMALL}
						type={ButtonTypes.DEFAULT}
						className="u-margin-left-sm"
						onClick={() => handleUpdate(item.id as string, { ...item, active: !item.active })}
					>
						<i className={classNames({
							'las': true,
							'la-plus': !item.active && !updateLoading,
							'la-minus': item.active && !updateLoading,
							'la-redo-alt': updateLoading,
							'la-spin': updateLoading,
						})}></i> {item.active ? 'Disable' : 'Enable'}
					</Button>
					<Button
						size={ButtonSizes.SMALL}
						type={ButtonTypes.DANGER}
						className="u-margin-left-sm"
						onClick={() => handleRemove(item.id as string)}
					>
						<i className={classNames({
							'las': true,
							'la-trash': !removeLoading,
							'la-redo-alt': removeLoading,
							'la-spin': removeLoading,
						})}></i> Remove
					</Button>
				</div>
			);
		},
	},
];
