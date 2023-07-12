import { FC } from 'react';
import { BRAND_ICONS } from './BrandIcon.const';
import { BrandIconProps } from './BrandIcon.types';

export const BrandIcon: FC<BrandIconProps> = ({ icon }) => {
	return BRAND_ICONS[icon] || null;
};
