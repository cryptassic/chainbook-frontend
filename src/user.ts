import { browser } from '$app/environment';
import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
import { user as userStore } from './stores/store';

export const connect = async () => {
	if (browser) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if ((window as any).keplr) {
			await handleLogin();
		} else {
			const error = getDefaultWalletNotificationModal(
				'Keplr Wallet Extension not found! Please install wallet and try again.'
			);

			modalStore.trigger(error);
		}
	}
};

function getDefaultWalletNotificationModal(body: string): ModalSettings {
	return {
		type: 'alert',
		title: 'Keplr',
		body: body
	};
}

async function handleLogin() {
	if (!window.keplr) {
		console.error('Keplr extension not found!');
		return;
	}

	const chainId = 'cosmoshub-4';

	// Enabling before using the Keplr is recommended.
	// This method will ask the user whether to allow access if they haven't visited this website.
	// Also, it will request that the user unlock the wallet if the wallet is locked.
	await window.keplr.enable(chainId);

	const offlineSigner = window.keplr.getOfflineSigner(chainId);

	// You can get the address/public keys by `getAccounts` method.
	// It can return the array of address/public key.
	// But, currently, Keplr extension manages only one address/public key pair.
	// XXX: This line is needed to set the sender address for SigningCosmosClient.
	const accounts = await offlineSigner.getAccounts();

	if (accounts.length >= 1) {
		userStore.set({ account: accounts[0], offlineSigner: offlineSigner });
	}
}
