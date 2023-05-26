import { browser } from '$app/environment';
import { loadPersistentUser, isUserWalletConnected, connect } from '$lib/wallet';

export const load = async () => {
	if (browser) {
		console.time('login');

		// Loads persistent user from local storage to our userStore. This is how we keep sessions.
		loadPersistentUser();

		if (isUserWalletConnected()) {
			await connect();
		}

		console.timeEnd('login');
	}
};
