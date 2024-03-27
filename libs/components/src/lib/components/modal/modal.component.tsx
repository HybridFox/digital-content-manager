import { FC, useEffect, useState } from 'react';
import cx from 'classnames/bind';
import ReactModal from 'react-modal';

import { Button, ButtonSizes, ButtonTypes } from '../button';

import styles from './modal.module.scss';
import { IModalFooterProps, IModalProps } from './modal.types';

const cxBind = cx.bind(styles);

export const Modal: FC<IModalProps> = ({ title, children, modalOpen, onClose, size }: IModalProps) => {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		setIsOpen(modalOpen);
	}, [modalOpen]);

	useEffect(() => {
		if (isOpen === false) {
			onClose && onClose();
		}
	}, [isOpen])

	// TODO: find a fix for this
	if (!isOpen) {
		return <></>
	}

	return (
		<ReactModal isOpen={isOpen} className={cxBind('m-modal', `m-modal--${size}`)} onRequestClose={() => setIsOpen(false)}>
			<div className={cxBind('m-modal__header')}>
				<h2 className={cxBind('m-modal__title')}>{title}</h2>
				<Button onClick={() => setIsOpen(false)} size={ButtonSizes.SMALL} type={ButtonTypes.TRANSPARENT} className={cxBind('m-modal__close')}>
					<span className="las la-times"></span>
				</Button>
			</div>
			<div className={cxBind('m-modal__content')}>{children}</div>
		</ReactModal>
	);
};

export const ModalFooter: FC<IModalFooterProps> = ({ children }: IModalFooterProps) => {
	return <div className={cxBind('m-modal__footer')}>{children}</div>
}
