<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	// Required for FloatUI popups
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { AppShell, Modal, storePopup } from '@skeletonlabs/skeleton';

	import Navigation from '$lib/Navigation/navigation.svelte';

	import { browser } from '$app/environment';
	import { userStorage } from '../stores/store';

	// Passing required FloatUI modules. This is required for popups to work
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	// Writes all userStorage data into localstorage. Used to handle wallet connections.
	userStorage.subscribe((value) => {
		if (browser && value) {
			window.localStorage.setItem('@chainbook-user', JSON.stringify(value));
		}
	});
</script>

<svelte:head>
	<link rel="icon" href="https://fav.farm/🔮" />
	<title>ChainBook</title>
</svelte:head>

<Modal />
<AppShell>
	<svelte:fragment slot="header">
		<Navigation />
	</svelte:fragment>
	<!-- (sidebarLeft) -->
	<!-- (sidebarRight) -->
	<!-- (pageHeader) -->
	<!-- Router Slot -->
	<slot />
	<!-- ---- / ---- -->
	<svelte:fragment slot="pageFooter">Page Footer</svelte:fragment>
	<!-- (footer) -->
</AppShell>
