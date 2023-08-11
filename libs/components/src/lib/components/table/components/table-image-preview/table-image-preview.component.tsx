import { FC } from 'react';
import cx from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import { ITableImagePreviewProps } from './table-image-preview.types';
import styles from './table-image-preview.module.scss';

const cxBind = cx.bind(styles);

export const TableImagePreview: FC<ITableImagePreviewProps> = ({
	url
}: ITableImagePreviewProps) => {
	const uuid = Math.random().toString(36).substring(2,7);

	return (
		<div className={cxBind('a-table-image-preview')}>
			<Tooltip anchorSelect={`#tt-${uuid}`} place='right' clickable>
				<img src={url} alt="alt" className={cxBind('a-table-image-preview__image')} />
			</Tooltip>
			<div className={cxBind('a-table-image-preview__icon')} id={`tt-${uuid}`}>
				<img src={url} alt="alt" />
			</div>
		</div>
	);
};
