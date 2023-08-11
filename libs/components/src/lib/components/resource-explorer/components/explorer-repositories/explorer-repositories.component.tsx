import { FC } from 'react';
import cx from 'classnames/bind';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { Badge } from '../../../badge';

import styles from './explorer-repositories.module.scss';
import { IExplorerRepositoriesProps } from './explorer-repositories.types';

const cxBind = cx.bind(styles);

export const ExplorerRepositories: FC<IExplorerRepositoriesProps> = ({
	repositories,
	className,
	selectedRepositoryId,
	onSelect,
}: IExplorerRepositoriesProps) => {
	const { t } = useTranslation();

	return (
		<div className={classNames(className, cxBind('o-explorer-repositories'))}>
			{repositories.map((repo) => (
				<div
					onClick={() => onSelect(repo.id)}
					key={repo.id}
					className={classNames(
						cxBind('o-explorer-repositories__repository', {
							'o-explorer-repositories__repository--selected': repo.id === selectedRepositoryId,
						})
					)}
				>
					<h4>{repo.name}</h4>
					<Badge>{t(`STORAGE_REPOSITORIES.KINDS.${repo.kind.toUpperCase()}`)}</Badge>
				</div>
			))}
		</div>
	);
};
