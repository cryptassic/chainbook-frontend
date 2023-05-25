import { writable } from 'svelte/store';

export const userStorage = writable<UserStorage | undefined>();
export const clientStorage = writable<SigningCosmWasmClient | undefined>();
