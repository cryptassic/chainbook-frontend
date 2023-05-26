import { get } from 'svelte/store';
import { userStorage, clientStorage } from '../stores/store';

import { browser } from '$app/environment';
import { getDefaultWalletNotificationModal, trigger } from '$lib/drawer';

import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';

const DEFAULT_CHAINID = 'cosmoshub-4';

export const connect = async () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if (window?.keplr) {
		const chainId = DEFAULT_CHAINID;
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
			//This user will also be stored in browser local storage for persistency between sessions.
			// Also, it will overide previously saved user data.
			userStorage.set({
				address: accounts[0].address,
				chainId: chainId,
				status: 'connected'
			});

			await connectWasmClient();
		} else {
			console.error(`${new Date().toISOString()} - Got offlineSigner, but there are no accounts!`);
		}
	} else {
		const error = getDefaultWalletNotificationModal(
			'Keplr Wallet Extension not found! Please install wallet and try again.'
		);
		trigger(error);
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

	clientStorage.set(undefined);
};

export async function getSigner(chainId: string) {
	if (!window?.keplr) {
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
export async function getWasmClient(chainId: string): Promise<SigningCosmWasmClient | undefined> {
	if (browser) {
		try {
			const offlineSigner = await getSigner(chainId);

			const client = await SigningCosmWasmClient.connectWithSigner(
				'https://cosmos-rpc.polkachu.com',
				offlineSigner as OfflineSigner
			);

			return client;
		} catch (error) {
			console.error(`${new Date().toISOString()} - Failed to get CosmWasmClient! `);
		}

		return;
	}
}
export async function connectWasmClient() {
	if (browser) {
		overideDefaultFetcher();

		const user = get(userStorage);

		if (user && user.status === 'connected') {
			const wasm = await getWasmClient(user.chainId);

			clientStorage.set(wasm);
		} else {
			console.error("There is no user connected. Can't connect to WASM client.");
		}
	}
}
export function isUserWalletConnected(): boolean {
	const user = get(userStorage);

	return (user && user.status === 'connected') ?? false;
}
export function loadPersistentUser() {
	if (browser) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let persistentUser = window.localStorage.getItem('@chainbook-user') as any;

		if (persistentUser) {
			try {
				persistentUser = JSON.parse(persistentUser);
				userStorage.set(persistentUser);
			} catch (error) {
				console.error(`Can't parse persistent user data: ${JSON.stringify(persistentUser)}`);
			}
		}
	}
}
//This solves CORS problem. If content-type: application/json is set in our request,
// it fails because polkachu does not return approved methods and headers.
function overideDefaultFetcher() {
	if (browser) {
		const originalFetch = window.fetch;

		// Override the fetch function
		window.fetch = async (url, options) => {
			// Modify the request or perform any additional actions here
			console.log('Intercepted fetch:', url, options);
			if (url === 'https://cosmos-rpc.polkachu.com') {
				if (options) options.headers = {};
			}
			// Call the original fetch function
			return originalFetch(url, options);
		};
	}
}
