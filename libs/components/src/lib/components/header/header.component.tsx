import { FC } from 'react';
import cx from 'classnames/bind';
import classNames from 'classnames';
import { Link, NavLink } from 'react-router-dom';

import { Badge } from '../badge';

import { IHeaderProps } from './header.types';
import styles from './header.module.scss';

const cxBind = cx.bind(styles);

const navLinkBinding = (disabled: boolean) => ({
	className: ({
		isActive,
		isPending,
	}: {
		isActive: boolean;
		isPending: boolean;
	}) =>
		cxBind({
			'm-header__tabs__link': true,
			'm-header__tabs__link--active': isActive,
			'm-header__tabs__link--pending': isPending,
			'm-header__tabs__link--disabled': disabled,
		}),
});

export const Header: FC<IHeaderProps> = ({
	title,
	className,
	action,
	tabs = [],
	breadcrumbs = [],
	metaTabs = [],
	metaInfo,
	subText,
}: IHeaderProps) => {
	return (
		<div className={classNames(className, cxBind('m-header'))}>
			<div className={cxBind('m-header__top')}>
				<div className={cxBind('m-header__content')}>
					{!!breadcrumbs?.length && (
						<ul className={cxBind('m-header__breadcrumbs')}>
							{breadcrumbs.map((breadcrumb, i) => (
								<li key={i} className={cxBind('m-header__breadcrumbs__item', {
									'm-header__breadcrumbs__item--disabled': breadcrumb.disabled
								})}>
									{breadcrumb.to ? (
										<Link to={breadcrumb.to}>
											{breadcrumb.label || '...'}
										</Link>
									) : (
										<p>{breadcrumb.label || '...'}</p>
									)}
									{breadcrumb.badge && (
										<Badge>{breadcrumb.badge}</Badge>
									)}
								</li>
							))}
						</ul>
					)}
					<h1 className={cxBind('m-header__title')}>{title}</h1>
				</div>
				{action && (
					<div className={cxBind('m-header__action')}>{action}</div>
				)}
			</div>
			<div className={cxBind("m-header__footer")}>
				{!!tabs?.length && (
					<div className={cxBind('m-header__tabs')}>
						{tabs.map((tab) => (
							<NavLink {...navLinkBinding(!!tab.disabled)} to={tab.to} key={tab.to}>
								{tab.label}
							</NavLink>
						))}
					</div>
				)}
				{!!metaTabs?.length && (
					<div className={cxBind('m-header__tabs', 'm-header__tabs--meta')}>
						{metaTabs.map((tab) => (
							<NavLink {...navLinkBinding(!!tab.disabled)} to={tab.to} key={tab.to}>
								{tab.label}
							</NavLink>
						))}
					</div>
				)}
				{metaInfo && (
					<div className={cxBind("m-header__meta")}>
						{metaInfo}
					</div>
				)}
			</div>
			{subText && (
				<div className={cxBind("m-header__sub-text")}>
					{subText}
				</div>
			)}
		</div>
	);
};
