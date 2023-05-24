<script lang="ts">
	import { get } from 'svelte/store';
	import { cartItems, addToCart, removeFromCart } from '../cart';

	export let product: Product = { id: '', name: '', price: 0 };

	let cart = get(cartItems);

	let cartProduct = cart.find((item) => item.id === product.id);

	cartItems.subscribe((value) => {
		cart = value;
		cartProduct = cart.find((item) => item.id === product.id);
	});

	// console.log(product);
</script>

<div class="card">
	<header class="card-header">
		<h2>{product.name}</h2>
	</header>
	{#if cartProduct !== undefined}
		<div class="card-body px-4">Quantity: <strong>{cartProduct.quantity}</strong></div>
	{/if}
	<div class="card-body px-4">Price: {product.price}$</div>
	<footer class="card-footer">
		<button class="p-2 rounded variant-glass-primary" on:click={() => addToCart(product.id)}
			>Add</button
		>
		<button class="p-2 rounded variant-glass-error" on:click={() => removeFromCart(product.id)}
			>Remove</button
		>
	</footer>
</div>
