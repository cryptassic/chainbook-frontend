// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

declare type AccountData = import('@keplr-wallet/types').AccountData;
declare type OfflineSigner = import('@keplr-wallet/types').OfflineAminoSigner &
	import('@keplr-wallet/types').OfflineDirectSigner;

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

declare class User {
	account: AccountData;
	offlineSigner: OfflineSigner;
}
