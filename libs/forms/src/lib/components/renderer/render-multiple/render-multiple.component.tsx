import { FC } from 'react';
import { useFieldArray } from 'react-hook-form';
import cx from 'classnames/bind';
import { Button, ButtonSizes, ButtonTypes } from '@ibs/components';

import { IRenderMultipleProps } from './render-multiple.types';
import styles from './render-multiple.module.scss';
const cxBind = cx.bind(styles);

export const RenderMultiple: FC<IRenderMultipleProps> = ({ field, children, fieldPrefix = '' }: IRenderMultipleProps) => {
	const { fields, append, remove, move } = useFieldArray({
		name: `${fieldPrefix}${field.slug}`,
	});

	return (
		<div className={cxBind('o-render-multiple')}>
			<h4 className={cxBind('o-render-multiple__title')}>{field.name}</h4>
			<div className={cxBind('o-render-multiple__fields')}>
				{fields.map((_, index) => (
					<div className={cxBind('o-render-multiple__field')} key={index}>
						<div className={cxBind('o-render-multiple__field__order')}>
							<Button
								disabled={index === 0}
								size={ButtonSizes.EXTRA_SMALL}
								type={ButtonTypes.TRANSPARENT}
								onClick={() => move(index, index - 1)}
							>
								<i className="las la-angle-up"></i>
							</Button>
							<Button
								disabled={index === fields.length - 1}
								size={ButtonSizes.EXTRA_SMALL}
								type={ButtonTypes.TRANSPARENT}
								onClick={() => move(index, index + 1)}
							>
								<i className="las la-angle-down"></i>
							</Button>
						</div>
						<div className={cxBind('o-render-multiple__field__content')}>{children(index)}</div>
						<div className={cxBind('o-render-multiple__field__actions')}>
							<Button size={ButtonSizes.NORMAL} type={ButtonTypes.SECONDARY} onClick={() => remove(index)}>
								<i className="las la-trash"></i>
							</Button>
						</div>
					</div>
				))}
			</div>
			<button className={cxBind('o-render-multiple__add')} onClick={() => append(null)}>
				<i className="las la-plus"></i>
				<p>
					Add <i>"{field.name}"</i> entry
				</p>
			</button>
		</div>
	);
};
