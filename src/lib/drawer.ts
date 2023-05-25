import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';

export function getDefaultWalletNotificationModal(body: string): ModalSettings {
	return {
		type: 'alert',
		title: 'Keplr',
		body: body
	};
}

export const trigger = (modal: ModalSettings) => modalStore.trigger(modal);
