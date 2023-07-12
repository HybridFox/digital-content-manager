import { ReactNode } from 'react';
import { HeadingStyles, HeadingTypes } from './Heading.const';

export type HeadingProps = {
	headingType: `${HeadingTypes}`;
	headingStyle: `${HeadingStyles}`;
	children: ReactNode;
	classNames?: string;
};
