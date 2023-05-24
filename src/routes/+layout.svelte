<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';

	import { AppShell, Modal } from '@skeletonlabs/skeleton';
	import Navigation from '$lib/Navigation/navigation.svelte';
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
