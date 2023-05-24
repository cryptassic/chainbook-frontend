import { writable, get } from 'svelte/store';

export const cartItems = writable<CartItem[]>([]);

export const addToCart = (id: string) => {
	const items = get(cartItems);

	const foundItem = items.find((item) => item.id === id);

	if (foundItem) {
		cartItems.update(() => {
			const updatedItems = items.map((item) => {
				if (item.id === id) {
					return { ...item, quantity: item.quantity + 1 };
				}
				return item;
			});

			return updatedItems;
		});
	} else {
		items.push({ id: id, quantity: 1 });

		cartItems.set(items);
	}
};

export const removeFromCart = (id: string) => {
	const items = get(cartItems);

	const itemPosition = items.findIndex((item) => item.id === id);

	// Dont procceed if non existant object
	if (itemPosition === -1) return;

	if (items[itemPosition].quantity - 1 === 0) {
		items.splice(itemPosition, 1);
		cartItems.set(items);
		return;
	}

	cartItems.update(() => {
		const updatedItems = items.map((item) => {
			if (item.id === id) {
				return { ...item, quantity: item.quantity - 1 };
			}
			return item;
		});

		return updatedItems;
	});
};
