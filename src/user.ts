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

// export const addToCart = (id: string) => {
// 	const items = get(cartItems);

// 	const foundItem = items.find((item) => item.id === id);

// 	if (foundItem) {
// 		cartItems.update(() => {
// 			const updatedItems = items.map((item) => {
// 				if (item.id === id) {
// 					return { ...item, quantity: item.quantity + 1 };
// 				}
// 				return item;
// 			});

// 			return updatedItems;
// 		});
// 	} else {
// 		items.push({ id: id, quantity: 1 });

// 		cartItems.set(items);
// 	}
// };

// export const removeFromCart = (id: string) => {
// 	const items = get(cartItems);

// 	const itemPosition = items.findIndex((item) => item.id === id);

// 	// Dont procceed if non existant object
// 	if (itemPosition === -1) return;

// 	if (items[itemPosition].quantity - 1 === 0) {
// 		items.splice(itemPosition, 1);
// 		cartItems.set(items);
// 		return;
// 	}

// 	cartItems.update(() => {
// 		const updatedItems = items.map((item) => {
// 			if (item.id === id) {
// 				return { ...item, quantity: item.quantity - 1 };
// 			}
// 			return item;
// 		});

// 		return updatedItems;
// 	});
// };
