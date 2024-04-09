import { FC, lazy } from 'react';
import cx from 'classnames/bind';

import { IEditorProps } from './editor.types';
import styles from './editor.module.scss';
const ReactEditor = lazy(() => import('@monaco-editor/react'));

const cxBind = cx.bind(styles);

export const Editor: FC<IEditorProps> = ({ value, defaultLanguage, onChange }: IEditorProps) => {
	return (
		<ReactEditor
			defaultValue={value}
			defaultLanguage={defaultLanguage}
			className={cxBind('a-editor')}
			options={{
				minimap: {
					enabled: false,
				},
				lineNumbers: 'off',
			}}
			onChange={(value) => onChange && onChange(value)}
		/>
	);
};
