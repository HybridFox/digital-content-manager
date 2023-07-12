import { createElement, FC } from 'react';
import { HeadingProps } from './Heading.types';

export const Heading: FC<HeadingProps> = ({
	headingStyle,
	headingType,
	children,
	classNames,
}) => {
	return createElement(
		headingType,
		{
			className: `${headingStyle} ${classNames}`,
		},
		children,
	);
};
