import { FC, useState } from 'react';
import cx from 'classnames/bind';
import classNames from 'classnames';

import { ModalFooter, Modal } from '../modal';

import styles from './button.module.scss';
import { IButtonProps } from './button.types';
import { HTMLButtonTypes, ButtonTypes, ButtonSizes } from './button.const';

const cxBind = cx.bind(styles);

export const Button: FC<IButtonProps> = ({
	children,
	htmlType = HTMLButtonTypes.BUTTON,
	type = ButtonTypes.DEFAULT,
	size = ButtonSizes.NORMAL,
	block,
	className,
	onClick,
	disabled,
	active,
	id,
	confirmable,
	confirmText,
	confirmTitle,
	confirmLoading
}: IButtonProps) => {
	const [modalOpen, setModalOpen] = useState(false);

	const handleClick = () => {
		if (!confirmable && onClick) {
			return onClick();
		}

		setModalOpen(true)
	}

	const handleClose = () => {
		setModalOpen(false);
	}

	return (
		<>
			<button
				id={id}
				disabled={disabled}
				type={htmlType}
				onClick={handleClick}
				className={classNames(
					className,
					cxBind('a-button', `a-button--${type}`, `a-button--${size}`, {
						'a-button--block': block,
						'a-button--active': active,
					})
				)}
			>
				{children}
			</button>
			{confirmable && (
				<Modal modalOpen={modalOpen} title={confirmTitle || "Are you sure?"} onClose={handleClose}>
					{confirmText || "Are you sure you wish to executive this action?"}
					<ModalFooter>
						<Button type={ButtonTypes.OUTLINE} className="u-margin-right-xs" onClick={() => setModalOpen(false)}>
							Cancel
						</Button>
						<Button type={ButtonTypes.PRIMARY} onClick={onClick}>
							{confirmLoading && <i className="las la-redo-alt la-spin"></i>} Confirm
						</Button>
					</ModalFooter>
				</Modal>
			)}
		</>
	);
};
