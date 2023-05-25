import { browser } from '$app/environment';
import { userStorage } from './stores/store';

import { getDefaultWalletNotificationModal, trigger } from '$lib/drawer';

export const connect = async () => {
	if (browser) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if (window.keplr) {
			const chainId = 'cosmoshub-4';
			const offlineSigner = await getSigner(chainId);

			if (!offlineSigner) {
				console.error(`${new Date().toISOString()} - Can't get offlineSigner from Keplr Wallet!`);
				return;
			}
			// You can get the address/public keys by `getAccounts` method.
			// It can return the array of address/public key.
			// But, currently, Keplr extension manages only one address/public key pair.
			// XXX: This line is needed to set the sender address for SigningCosmosClient.
			const accounts = await offlineSigner.getAccounts();

			if (accounts.length >= 1) {
				// userStore.set({ account: accounts[0], offlineSigner: offlineSigner });

				userStorage.set({
					address: accounts[0].address,
					chainId: chainId,
					status: 'connected'
				});
			} else {
				console.error(
					`${new Date().toISOString()} - Got offlineSigner, but there are no accounts!`
				);
			}
		} else {
			const error = getDefaultWalletNotificationModal(
				'Keplr Wallet Extension not found! Please install wallet and try again.'
			);
			trigger(error);
		}
	}
};
export const disconnect = () => {
	userStorage.update((value) => {
		if (value) {
			value.address = undefined;
			value.status = 'idle';
		}
		return value;
	});
};

export async function getSigner(chainId: string) {
	if (!window.keplr) {
		console.error('Keplr extension not found!');
		return;
	}

	// Enabling before using the Keplr is recommended.
	// This method will ask the user whether to allow access if they haven't visited this website.
	// Also, it will request that the user unlock the wallet if the wallet is locked.
	await window.keplr.enable(chainId);

	const offlineSigner = window.keplr.getOfflineSigner(chainId);

	return offlineSigner;
}
