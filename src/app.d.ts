// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

declare type AccountData = import('@keplr-wallet/types').AccountData;
declare type SigningCosmWasmClient = import('@cosmjs/cosmwasm-stargate').SigningCosmWasmClient;
// declare type OfflineSigner = import('@keplr-wallet/types').OfflineAminoSigner &
// 	import('@keplr-wallet/types').OfflineDirectSigner;

declare namespace App {
	// interface Locals {}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
	// interface User {
	// 	name: string;
	// 	age: number;
	// 	account: AccountData;
	// }
}

declare class Product {
	id: string;
	name: string;
	price: number;
}

declare class CartItem {
	id: string;
	quantity: number;
}

declare class UserStorage {
	chainId: string;
	status: string;
	address?: string | undefined;
}
