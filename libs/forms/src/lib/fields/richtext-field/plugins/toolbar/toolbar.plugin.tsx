/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { LexicalEditor, NodeKey } from 'lexical';
import { $createCodeNode, $isCodeNode, CODE_LANGUAGE_FRIENDLY_NAME_MAP, CODE_LANGUAGE_MAP } from '@lexical/code';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
	$isListNode,
	INSERT_CHECK_LIST_COMMAND,
	INSERT_ORDERED_LIST_COMMAND,
	INSERT_UNORDERED_LIST_COMMAND,
	ListNode,
	REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, $isQuoteNode, HeadingTagType } from '@lexical/rich-text';
import { $getSelectionStyleValueForProperty, $isParentElementRTL, $patchStyleText, $setBlocksType } from '@lexical/selection';
import { $isTableNode } from '@lexical/table';
import { $findMatchingParent, $getNearestBlockElementAncestorOrThrow, $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
	$createParagraphNode,
	$getNodeByKey,
	$getSelection,
	$isRangeSelection,
	$isRootOrShadowRoot,
	$isTextNode,
	CAN_REDO_COMMAND,
	CAN_UNDO_COMMAND,
	COMMAND_PRIORITY_CRITICAL,
	COMMAND_PRIORITY_NORMAL,
	DEPRECATED_$isGridSelection,
	FORMAT_TEXT_COMMAND,
	KEY_MODIFIER_COMMAND,
	REDO_COMMAND,
	SELECTION_CHANGE_COMMAND,
	UNDO_COMMAND,
} from 'lexical';
import { useCallback, useEffect, useState } from 'react';
import * as React from 'react';
import cx from 'classnames/bind';
import classNames from 'classnames';
import { SketchPicker } from 'react-color';
import { Tooltip } from 'react-tooltip';

import { Button, ButtonTypes, Select } from '~components';

import { getSelectedNode } from '../../utils/getSelectNode';
import { sanitizeUrl } from '../../utils/url';
import { IS_APPLE } from '../../utils/dom';

// import useModal from '../../hooks/useModal';
// import catTypingGif from '../../images/cat-typing.gif';
// import { $createStickyNode } from '../../nodes/StickyNode';
// import DropDown, { DropDownItem } from '../../ui/DropDown';
// import DropdownColorPicker from '../../ui/DropdownColorPicker';
// import { getSelectedNode } from '../../utils/getSelectedNode';
// import { sanitizeUrl } from '../../utils/url';
// import { EmbedConfigs } from '../AutoEmbedPlugin';
// import { INSERT_COLLAPSIBLE_COMMAND } from '../CollapsiblePlugin';
// import { InsertEquationDialog } from '../EquationsPlugin';
// import { INSERT_EXCALIDRAW_COMMAND } from '../ExcalidrawPlugin';
// import { INSERT_IMAGE_COMMAND, InsertImageDialog, InsertImagePayload } from '../ImagesPlugin';
// import { InsertInlineImageDialog } from '../InlineImagePlugin';
// import { INSERT_PAGE_BREAK } from '../PageBreakPlugin';
// import { InsertPollDialog } from '../PollPlugin';
// import { InsertNewTableDialog, InsertTableDialog } from '../TablePlugin';
import styles from './toolbar.module.scss';
const cxBind = cx.bind(styles);

const blockTypeToBlockName = {
	bullet: 'Bulleted List',
	check: 'Check List',
	code: 'Code Block',
	h1: 'Heading 1',
	h2: 'Heading 2',
	h3: 'Heading 3',
	h4: 'Heading 4',
	h5: 'Heading 5',
	h6: 'Heading 6',
	number: 'Numbered List',
	paragraph: 'Normal',
	quote: 'Quote',
};

const rootTypeToRootName = {
	root: 'Root',
	table: 'Table',
};

function getCodeLanguageOptions(): [string, string][] {
	const options: [string, string][] = [];

	for (const [lang, friendlyName] of Object.entries(CODE_LANGUAGE_FRIENDLY_NAME_MAP)) {
		options.push([lang, friendlyName]);
	}

	return options;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

const FONT_FAMILY_OPTIONS: [string, string][] = [
	['Arial', 'Arial'],
	['Courier New', 'Courier New'],
	['Georgia', 'Georgia'],
	['Times New Roman', 'Times New Roman'],
	['Trebuchet MS', 'Trebuchet MS'],
	['Verdana', 'Verdana'],
];

const FONT_SIZE_OPTIONS: [string, string][] = [
	['10px', '10px'],
	['11px', '11px'],
	['12px', '12px'],
	['13px', '13px'],
	['14px', '14px'],
	['15px', '15px'],
	['16px', '16px'],
	['17px', '17px'],
	['18px', '18px'],
	['19px', '19px'],
	['20px', '20px'],
];

function dropDownActiveClass(active: boolean) {
	if (active) return 'active dropdown-item-active';
	else return '';
}

function BlockFormatDropDown({
	editor,
	blockType,
	rootType,
	disabled = false,
}: {
	blockType: keyof typeof blockTypeToBlockName;
	rootType: keyof typeof rootTypeToRootName;
	editor: LexicalEditor;
	disabled?: boolean;
}): JSX.Element {
	const formatParagraph = () => {
		editor.update(() => {
			const selection = $getSelection();
			if ($isRangeSelection(selection) || DEPRECATED_$isGridSelection(selection)) {
				$setBlocksType(selection, () => $createParagraphNode());
			}
		});
	};

	const formatHeading = (headingSize: HeadingTagType) => {
		console.log('fHeading')
		if (blockType !== headingSize) {
			editor.update(() => {
				const selection = $getSelection();
				if ($isRangeSelection(selection) || DEPRECATED_$isGridSelection(selection)) {
					$setBlocksType(selection, () => $createHeadingNode(headingSize));
				}
			});
		}
	};

	const formatBulletList = () => {
		if (blockType !== 'bullet') {
			editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
		} else {
			editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
		}
	};

	const formatCheckList = () => {
		if (blockType !== 'check') {
			editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
		} else {
			editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
		}
	};

	const formatNumberedList = () => {
		if (blockType !== 'number') {
			editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
		} else {
			editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
		}
	};

	const formatQuote = () => {
		if (blockType !== 'quote') {
			editor.update(() => {
				const selection = $getSelection();
				if ($isRangeSelection(selection) || DEPRECATED_$isGridSelection(selection)) {
					$setBlocksType(selection, () => $createQuoteNode());
				}
			});
		}
	};

	const formatCode = () => {
		if (blockType !== 'code') {
			editor.update(() => {
				let selection = $getSelection();

				if ($isRangeSelection(selection) || DEPRECATED_$isGridSelection(selection)) {
					if (selection.isCollapsed()) {
						$setBlocksType(selection, () => $createCodeNode());
					} else {
						const textContent = selection.getTextContent();
						const codeNode = $createCodeNode();
						selection.insertNodes([codeNode]);
						selection = $getSelection();
						if ($isRangeSelection(selection)) selection.insertRawText(textContent);
					}
				}
			});
		}
	};

	const options = [
		{
			label: 'Paragraph',
			value: 'paragraph',
			onClick: formatParagraph,
			active: blockType === 'paragraph',
		},
		{
			label: 'Heading 1',
			value: 'h1',
			onClick: () => formatHeading('h1'),
			active: blockType === 'h1',
		},
		{
			label: 'Heading 2',
			value: 'h2',
			onClick: () => formatHeading('h2'),
			active: blockType === 'h2',
		},
		{
			label: 'Heading 3',
			value: 'h3',
			onClick: () => formatHeading('h3'),
			active: blockType === 'h3',
		},
		{
			label: 'Bullet list',
			value: 'bullet',
			onClick: () => formatBulletList(),
			active: blockType === 'bullet',
		},
		{
			label: 'Numbered list',
			value: 'number',
			onClick: () => formatNumberedList(),
			active: blockType === 'number',
		},
		{
			label: 'Check list',
			value: 'check',
			onClick: () => formatCheckList(),
			active: blockType === 'check',
		},
		{
			label: 'Quote',
			value: 'quote',
			onClick: () => formatQuote(),
			active: blockType === 'quote',
		},
		{
			label: 'Code Block',
			value: 'code',
			onClick: () => formatCode(),
			active: blockType === 'code',
		},
	];

	return (
		<Select
			placeholder="Text Style"
			className={cxBind('a-toolbar__item', 'a-toolbar__item--format')}
			value={null}
			options={options}
			closeMenuOnSelect={false}
		/>
	);
}

function Divider(): JSX.Element {
	return <div className={cxBind('a-toolbar__divider')} />;
}

function FontDropDown({
	editor,
	value,
	style,
	disabled = false,
}: {
	editor: LexicalEditor;
	value: string;
	style: string;
	disabled?: boolean;
}): JSX.Element {
	const handleClick = useCallback(
		(option: string) => {
			editor.update(() => {
				const selection = $getSelection();
				if ($isRangeSelection(selection)) {
					$patchStyleText(selection, {
						[style]: option,
					});
				}
			});
		},
		[editor, style]
	);

	const item = (style === 'font-family' ? FONT_FAMILY_OPTIONS : FONT_SIZE_OPTIONS).find(([option]) => option === value);

	return (
		<Select
			className={cxBind('a-toolbar__item')}
			value={item ? { value, label: item?.[0] } : undefined}
			options={(style === 'font-family' ? FONT_FAMILY_OPTIONS : FONT_SIZE_OPTIONS).map(([option, text]) => ({
				label: text,
				value: option,
				onClick: () => handleClick(option),
			}))}
		/>
	);
}

export const ToolbarPlugin = (): JSX.Element => {
	const [editor] = useLexicalComposerContext();
	const [activeEditor, setActiveEditor] = useState(editor);
	const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockName>('paragraph');
	const [rootType, setRootType] = useState<keyof typeof rootTypeToRootName>('root');
	const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(null);
	const [fontSize, setFontSize] = useState<string>('15px');
	const [fontColor, setFontColor] = useState<string>('#000');
	const [bgColor, setBgColor] = useState<string>('#fff');
	const [fontFamily, setFontFamily] = useState<string>('Arial');
	const [isLink, setIsLink] = useState(false);
	const [isBold, setIsBold] = useState(false);
	const [isItalic, setIsItalic] = useState(false);
	const [isUnderline, setIsUnderline] = useState(false);
	const [isStrikethrough, setIsStrikethrough] = useState(false);
	const [isSubscript, setIsSubscript] = useState(false);
	const [isSuperscript, setIsSuperscript] = useState(false);
	const [isCode, setIsCode] = useState(false);
	const [canUndo, setCanUndo] = useState(false);
	const [canRedo, setCanRedo] = useState(false);
	// const [modal, showModal] = useModal();
	const [isRTL, setIsRTL] = useState(false);
	const [codeLanguage, setCodeLanguage] = useState<string>('');
	const [isEditable, setIsEditable] = useState(() => editor.isEditable());

	const $updateToolbar = useCallback(() => {
		const selection = $getSelection();
		if ($isRangeSelection(selection)) {
			const anchorNode = selection.anchor.getNode();
			let element =
				anchorNode.getKey() === 'root'
					? anchorNode
					: $findMatchingParent(anchorNode, (e) => {
							const parent = e.getParent();
							return parent !== null && $isRootOrShadowRoot(parent);
					  });

			if (element === null) {
				element = anchorNode.getTopLevelElementOrThrow();
			}

			const elementKey = element.getKey();
			const elementDOM = activeEditor.getElementByKey(elementKey);

			// Update text format
			setIsBold(selection.hasFormat('bold'));
			setIsItalic(selection.hasFormat('italic'));
			setIsUnderline(selection.hasFormat('underline'));
			setIsStrikethrough(selection.hasFormat('strikethrough'));
			setIsSubscript(selection.hasFormat('subscript'));
			setIsSuperscript(selection.hasFormat('superscript'));
			setIsCode(selection.hasFormat('code'));
			setIsRTL($isParentElementRTL(selection));

			// Update links
			const node = getSelectedNode(selection);
			const parent = node.getParent();
			if ($isLinkNode(parent) || $isLinkNode(node)) {
				setIsLink(true);
			} else {
				setIsLink(false);
			}

			const tableNode = $findMatchingParent(node, $isTableNode);
			if ($isTableNode(tableNode)) {
				setRootType('table');
			} else {
				setRootType('root');
			}

			if (elementDOM !== null) {
				setSelectedElementKey(elementKey);
				if ($isListNode(element)) {
					const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
					const type = parentList ? parentList.getListType() : element.getListType();
					setBlockType(type);
				} else {
					const type = $isHeadingNode(element) ? element.getTag() : element.getType();
					if (type in blockTypeToBlockName) {
						setBlockType(type as keyof typeof blockTypeToBlockName);
					}
					if ($isCodeNode(element)) {
						const language = element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
						setCodeLanguage(language ? CODE_LANGUAGE_MAP[language] || language : '');
						return;
					}
				}
			}
			// Handle buttons
			setFontSize($getSelectionStyleValueForProperty(selection, 'font-size', '15px'));
			setFontColor($getSelectionStyleValueForProperty(selection, 'color', '#000'));
			setBgColor($getSelectionStyleValueForProperty(selection, 'background-color', '#fff'));
			setFontFamily($getSelectionStyleValueForProperty(selection, 'font-family', 'Arial'));
		}
	}, [activeEditor]);

	useEffect(() => {
		return editor.registerCommand(
			SELECTION_CHANGE_COMMAND,
			(_payload, newEditor) => {
				$updateToolbar();
				setActiveEditor(newEditor);
				return false;
			},
			COMMAND_PRIORITY_CRITICAL
		);
	}, [editor, $updateToolbar]);

	useEffect(() => {
		return mergeRegister(
			editor.registerEditableListener((editable) => {
				setIsEditable(editable);
			}),
			activeEditor.registerUpdateListener(({ editorState }) => {
				editorState.read(() => {
					$updateToolbar();
				});
			}),
			activeEditor.registerCommand<boolean>(
				CAN_UNDO_COMMAND,
				(payload) => {
					setCanUndo(payload);
					return false;
				},
				COMMAND_PRIORITY_CRITICAL
			),
			activeEditor.registerCommand<boolean>(
				CAN_REDO_COMMAND,
				(payload) => {
					setCanRedo(payload);
					return false;
				},
				COMMAND_PRIORITY_CRITICAL
			)
		);
	}, [$updateToolbar, activeEditor, editor]);

	useEffect(() => {
		return activeEditor.registerCommand(
			KEY_MODIFIER_COMMAND,
			(payload) => {
				const event: KeyboardEvent = payload;
				const { code, ctrlKey, metaKey } = event;

				if (code === 'KeyK' && (ctrlKey || metaKey)) {
					event.preventDefault();
					return activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'));
				}
				return false;
			},
			COMMAND_PRIORITY_NORMAL
		);
	}, [activeEditor, isLink]);

	const applyStyleText = useCallback(
		(styles: Record<string, string>) => {
			activeEditor.update(() => {
				const selection = $getSelection();
				if ($isRangeSelection(selection)) {
					$patchStyleText(selection, styles);
				}
			});
		},
		[activeEditor]
	);

	const clearFormatting = useCallback(() => {
		activeEditor.update(() => {
			const selection = $getSelection();
			if ($isRangeSelection(selection)) {
				const anchor = selection.anchor;
				const focus = selection.focus;
				const nodes = selection.getNodes();

				if (anchor.key === focus.key && anchor.offset === focus.offset) {
					return;
				}

				nodes.forEach((node, idx) => {
					// We split the first and last node by the selection
					// So that we don't format unselected text inside those nodes
					if ($isTextNode(node)) {
						if (idx === 0 && anchor.offset !== 0) {
							node = node.splitText(anchor.offset)[1] || node;
						}
						if (idx === nodes.length - 1) {
							node = node.splitText(focus.offset)[0] || node;
						}

						if (node.__style !== '') {
							node.setStyle('');
						}
						if (node.__format !== 0) {
							node.setFormat(0);
							$getNearestBlockElementAncestorOrThrow(node).setFormat('');
						}
					} else if ($isHeadingNode(node) || $isQuoteNode(node)) {
						node.replace($createParagraphNode(), true);
					} else if ($isDecoratorBlockNode(node)) {
						node.setFormat('');
					}
				});
			}
		});
	}, [activeEditor]);

	const onFontColorSelect = useCallback(
		(value: string) => {
			applyStyleText({ color: value });
		},
		[applyStyleText]
	);

	const onBgColorSelect = useCallback(
		(value: string) => {
			applyStyleText({ 'background-color': value });
		},
		[applyStyleText]
	);

	const insertLink = useCallback(() => {
		if (!isLink) {
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'));
		} else {
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
		}
	}, [editor, isLink]);

	const onCodeLanguageSelect = useCallback(
		(value: string) => {
			activeEditor.update(() => {
				if (selectedElementKey !== null) {
					const node = $getNodeByKey(selectedElementKey);
					if ($isCodeNode(node)) {
						node.setLanguage(value);
					}
				}
			});
		},
		[activeEditor, selectedElementKey]
	);

	return (
		<div className={cxBind('a-toolbar')}>
			<Button
				disabled={!canUndo || !isEditable}
				onClick={() => {
					activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
				}}
				title={IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
				type={ButtonTypes.PRIMARY}
				className={cxBind('a-toolbar__item')}
				aria-label="Undo"
			>
				<i className="las la-undo" />
			</Button>
			<Button
				disabled={!canRedo || !isEditable}
				onClick={() => {
					activeEditor.dispatchCommand(REDO_COMMAND, undefined);
				}}
				title={IS_APPLE ? 'Redo (⌘Y)' : 'Redo (Ctrl+Y)'}
				type={ButtonTypes.PRIMARY}
				className={cxBind('a-toolbar__item')}
				aria-label="Redo"
			>
				<i className="las la-redo" />
			</Button>
			<Divider />
			{blockType in blockTypeToBlockName && activeEditor === editor && (
				<>
					<BlockFormatDropDown disabled={!isEditable} blockType={blockType} rootType={rootType} editor={editor} />
					<Divider />
				</>
			)}
			{blockType === 'code' ? (
				<Select
					className={cxBind('a-toolbar__item')}
					// value={}
					options={CODE_LANGUAGE_OPTIONS.map(([value, label]) => ({ value, label, onClick: () => onCodeLanguageSelect(value) }))}
				/>
			) : (
				<>
					{/* <FontDropDown disabled={!isEditable} style={'font-family'} value={fontFamily} editor={editor} />
					<FontDropDown disabled={!isEditable} style={'font-size'} value={fontSize} editor={editor} /> */}
					{/* <Divider /> */}
					<Button
						disabled={!isEditable}
						onClick={() => {
							activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
						}}
						className={cxBind('a-toolbar__item')}
						active={isBold}
						title={IS_APPLE ? 'Bold (⌘B)' : 'Bold (Ctrl+B)'}
						type={ButtonTypes.OUTLINE}
						aria-label={`Format text as bold. Shortcut: ${IS_APPLE ? '⌘B' : 'Ctrl+B'}`}
					>
						<i className="las la-bold" />
					</Button>
					<Button
						disabled={!isEditable}
						onClick={() => {
							activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
						}}
						className={cxBind('a-toolbar__item')}
						active={isItalic}
						title={IS_APPLE ? 'Italic (⌘I)' : 'Italic (Ctrl+I)'}
						type={ButtonTypes.OUTLINE}
						aria-label={`Format text as italics. Shortcut: ${IS_APPLE ? '⌘I' : 'Ctrl+I'}`}
					>
						<i className="las la-italic" />
					</Button>
					<Button
						disabled={!isEditable}
						onClick={() => {
							activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
						}}
						className={cxBind('a-toolbar__item')}
						active={isUnderline}
						title={IS_APPLE ? 'Underline (⌘U)' : 'Underline (Ctrl+U)'}
						type={ButtonTypes.OUTLINE}
						aria-label={`Format text to underlined. Shortcut: ${IS_APPLE ? '⌘U' : 'Ctrl+U'}`}
					>
						<i className="las la-underline" />
					</Button>
					<Button
						disabled={!isEditable}
						onClick={() => {
							activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
						}}
						className={cxBind('a-toolbar__item')}
						active={isCode}
						title="Insert code block"
						type={ButtonTypes.OUTLINE}
						aria-label="Insert code block"
					>
						<i className="las la-code" />
					</Button>
					<Button
						disabled={!isEditable}
						onClick={insertLink}
						className={cxBind('a-toolbar__item')}
						active={isLink}
						aria-label="Insert link"
						title="Insert link"
						type={ButtonTypes.OUTLINE}
					>
						<i className="las la-link" />
					</Button>
					{/*<Button className={cxBind('a-toolbar__color-picker', 'a-toolbar__item')} id="font-color" type={ButtonTypes.OUTLINE}>*/}
					{/*	<i className="las la-font" style={{ color: fontColor }}></i>*/}
					{/*</Button>*/}
					{/*<Tooltip anchorSelect="#font-color" className={cxBind('a-toolbar__color-picker__tooltip')} clickable>*/}
					{/*	<SketchPicker onChangeComplete={(value) => onFontColorSelect(value.hex)} color={fontColor} />*/}
					{/*</Tooltip>*/}
					{/*<Button className={cxBind('a-toolbar__color-picker', 'a-toolbar__item')} id="background-color" type={ButtonTypes.OUTLINE}>*/}
					{/*	<i className="las la-highlighter" style={{ color: bgColor }}></i>*/}
					{/*</Button>*/}
					{/*<Tooltip anchorSelect="#background-color" className={cxBind('a-toolbar__color-picker__tooltip')} clickable>*/}
					{/*	<SketchPicker onChangeComplete={(value) => onBgColorSelect(value.hex)} color={bgColor} />*/}
					{/*</Tooltip>*/}
					{/*<Select*/}
					{/*	placeholder="Formatting"*/}
					{/*	className={cxBind('a-toolbar__item', 'a-toolbar__item--format')}*/}
					{/*	closeMenuOnSelect={false}*/}
					{/*	value={null}*/}
					{/*	options={[*/}
					{/*		{*/}
					{/*			label: 'Strikethrough',*/}
					{/*			onClick: () => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough'),*/}
					{/*			active: isStrikethrough,*/}
					{/*		},*/}
					{/*		{*/}
					{/*			label: 'Subscript',*/}
					{/*			onClick: () => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript'),*/}
					{/*			active: isSubscript,*/}
					{/*		},*/}
					{/*		{*/}
					{/*			label: 'Superscript',*/}
					{/*			onClick: () => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript'),*/}
					{/*			active: isSuperscript,*/}
					{/*		},*/}
					{/*		{*/}
					{/*			label: 'Clear Formatting',*/}
					{/*			onClick: clearFormatting,*/}
					{/*		},*/}
					{/*	]}*/}
					{/*/>*/}
					<Divider />
					{rootType === 'table' && (
						<>
							{/* <DropDown
								disabled={!isEditable}
								buttonClassName="toolbar-item spaced"
								buttonLabel="Table"
								buttonAriaLabel="Open table toolkit"
								buttonIconClassName="icon table secondary"
							>
								<DropDownItem
									className="item"
								>
									<span className="text">TODO</span>
								</DropDownItem>
							</DropDown> */}
							<Divider />
						</>
					)}
					<Select
						placeholder="Insert"
						disabled={!isEditable}
						className={cxBind('a-toolbar__item', 'a-toolbar__item--format')}
						closeMenuOnSelect={false}
						value={null}
						options={[
							{
								label: 'Horizontal Rule',
								onClick: () => activeEditor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined),
							},
							// {
							// 	label: 'Page Break',
							// 	onClick: () => activeEditor.dispatchCommand(INSERT_PAGE_BREAK, undefined)
							// },
							{
								label: 'Image',
								onClick: () => console.log('show modal'),
							},
							{
								label: 'Inline Image',
								onClick: () => console.log('inline image'),
							},
							// {
							// 	label: 'Excalidraw',
							// 	onClick: () => activeEditor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined)
							// },
							// {
							// 	label: 'Excalidraw',
							// 	onClick: () => activeEditor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined)
							// },
						]}
					/>
				</>
			)}
			<Divider />
			{/*<Select*/}
			{/*	placeholder="Align"*/}
			{/*	disabled={!isEditable}*/}
			{/*	className={cxBind('a-toolbar__item', 'a-toolbar__item--format')}*/}
			{/*	closeMenuOnSelect={false}*/}
			{/*	value={null}*/}
			{/*	options={[*/}
			{/*		{*/}
			{/*			label: 'Left Align',*/}
			{/*			onClick: () => activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left'),*/}
			{/*		},*/}
			{/*		{*/}
			{/*			label: 'Center Align',*/}
			{/*			onClick: () => activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center'),*/}
			{/*		},*/}
			{/*		{*/}
			{/*			label: 'Right Align',*/}
			{/*			onClick: () => activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right'),*/}
			{/*		},*/}
			{/*		{*/}
			{/*			label: 'Justify Align',*/}
			{/*			onClick: () => activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify'),*/}
			{/*		},*/}
			{/*		{*/}
			{/*			label: 'Outdent',*/}
			{/*			onClick: () => activeEditor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined),*/}
			{/*		},*/}
			{/*		{*/}
			{/*			label: 'Indent',*/}
			{/*			onClick: () => activeEditor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined),*/}
			{/*		},*/}
			{/*	]}*/}
			{/*/>*/}
		</div>
	);
}
