import { browser } from '$app/environment';

import { get } from 'svelte/store';
import { userStorage, clientStorage } from '../stores/store';
import { getSigner } from '../user';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';

export const load = async () => {
	if (browser) {
		console.time('login');

		overideDefaultFetcher();
		loadPersistentUser();

		const user = get(userStorage);

		if (user && user.status === 'connected') {
			const wasm = await getWasmClient(user.chainId);

			clientStorage.set(wasm);
		}

		console.timeEnd('login');
	}
};

async function getWasmClient(chainId: string): Promise<SigningCosmWasmClient | undefined> {
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

function loadPersistentUser() {
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
