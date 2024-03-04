import { FC, useEffect, lazy } from 'react';
import { Controller, ControllerFieldState, ControllerRenderProps, FieldPath, FieldValues, UseFormStateReturn, useFormContext } from 'react-hook-form';
import cx from 'classnames/bind';
import { $generateHtmlFromNodes } from '@lexical/html';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { $getRoot, EditorState, LexicalEditor } from 'lexical';
import { $generateNodesFromDOM } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { FieldLabel } from '../../field-label/field-label.component';

import styles from './richtext-field.module.scss';
import { IRichtextFieldProps } from './richtext-field.types';
import { RICHTEXT_NODES } from './nodes';

const ToolbarPlugin = lazy(async () => ({
	default: (await import('./plugins/toolbar/toolbar.plugin')).ToolbarPlugin
}));
const cxBind = cx.bind(styles);

const InitializeDataPlugin = ({ value }: { value: any }) => {
    const [editor] = useLexicalComposerContext();

	useEffect(() => {
		editor.update(() => {
			const parser = new DOMParser();
			const document = parser.parseFromString(value, 'text/html');
			const nodes = $generateNodesFromDOM(editor, document);

			const root = $getRoot().select();
			root.insertNodes(nodes);
		})
	}, []);

	return null;
}

export const RichtextField: FC<IRichtextFieldProps> = ({
	name,
	label,
	placeholder,
	fieldOptions,
	fieldConfiguration,
	field,
}: IRichtextFieldProps) => {
	const { control } = useFormContext();

	const renderField = ({
		field: { onChange, value },
		formState: { errors },
	}: {
		field: ControllerRenderProps<FieldValues, FieldPath<FieldValues>>;
		fieldState: ControllerFieldState;
		formState: UseFormStateReturn<FieldValues>;
	}) => {
		const error = errors?.[name];
		const initialConfig = {
			namespace: 'editor',
			onError: console.error,
			nodes: [...RICHTEXT_NODES]
		};

		const handleChange = (editorState: EditorState, editor: LexicalEditor) => {
			editor.update(() => {
				const raw = $generateHtmlFromNodes(editor, null);
				onChange(raw);
			});
		};

		return (
			<div
				className={cxBind('a-input', {
					'a-input--has-error': !!error,
				})}
			>
				<FieldLabel label={label} multiLanguage={fieldConfiguration?.multiLanguage as boolean} name={name} />

				<LexicalComposer initialConfig={initialConfig}>
					<ToolbarPlugin />
					<ListPlugin />
					<LinkPlugin />
					<CheckListPlugin />
					<OnChangePlugin onChange={handleChange} ignoreSelectionChange />
					<RichTextPlugin
						contentEditable={<ContentEditable className={cxBind('a-input__field')} />}
						placeholder={null}
						ErrorBoundary={LexicalErrorBoundary}
					/>
					<InitializeDataPlugin value={value} />
					<HistoryPlugin />
				</LexicalComposer>
			</div>
		);
	};

	return (
		<div className={cxBind('a-input__field-wrapper')}>
			<Controller control={control} name={name} render={renderField} />
		</div>
	);
};
