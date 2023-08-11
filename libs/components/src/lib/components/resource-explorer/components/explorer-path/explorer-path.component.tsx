import { FC } from 'react';
import cx from 'classnames/bind';
import classNames from 'classnames';

import { Button, ButtonSizes, ButtonTypes } from '../../../button';

import styles from './explorer-path.module.scss';
import { IExplorerPathProps } from './explorer-path.types';

const cxBind = cx.bind(styles);

export const ExplorerPath: FC<IExplorerPathProps> = ({ path, className, onNavigate }: IExplorerPathProps) => {
	return (
		<div className={classNames(className, cxBind('o-explorer-path'))}>
			<div className={cxBind('o-explorer-path__piece')}>
				<Button onClick={() => onNavigate('/')} type={ButtonTypes.TRANSPARENT} size={ButtonSizes.EXTRA_SMALL}>
					&lt;root&gt;
				</Button>
			</div>
			{path.map((piece, i) => (
				<div key={i} className={cxBind('o-explorer-path__piece')}>
					<span>/</span>
					<Button onClick={() => onNavigate(piece)} type={ButtonTypes.TRANSPARENT} size={ButtonSizes.EXTRA_SMALL}>
						{piece}
					</Button>
				</div>
			))}
		</div>
	);
};
