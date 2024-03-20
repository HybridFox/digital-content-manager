import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { COMMAND_PRIORITY_LOW, createCommand, LexicalCommand, LexicalNode } from 'lexical';
import { useEffect } from 'react';

import { LinkAttributes, LinkNode, toggleLink } from '../helpers/link.helper';

export const SET_LINK_COMMAND: LexicalCommand<{ url: string } & LinkAttributes | null> = createCommand('SET_LINK_COMMAND');

export function CustomLinkPlugin(): null {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		if (!editor.hasNodes([LinkNode])) {
			throw new Error('LinkPlugin: LinkNode not registered on editor');
		}

		return mergeRegister(
			editor.registerCommand(
				SET_LINK_COMMAND,
				(payload) => {
					console.log(payload);
					if (payload === null) {
						toggleLink(payload);
						return true;
					} else {
						const { url, ...attributes } = payload;
						toggleLink(url, attributes);
						return true;
					}
				},
				COMMAND_PRIORITY_LOW
			)
		);
	}, [editor]);

	return null;
}

export function $getAncestor<NodeType extends LexicalNode = LexicalNode>(node: LexicalNode, predicate: (ancestor: LexicalNode) => ancestor is NodeType) {
	let parent = node;
	while (parent !== null && parent.getParent() !== null && !predicate(parent)) {
		parent = parent.getParentOrThrow();
	}
	return predicate(parent) ? parent : null;
}
