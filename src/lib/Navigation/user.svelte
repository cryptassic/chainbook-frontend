<script lang="ts">
	import { get } from 'svelte/store';
	import { userStorage } from '../../stores/store';
	import { disconnect } from '../wallet';

	import { popup, Avatar } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';

	const popupClick: PopupSettings = {
		event: 'click',
		target: 'popupClick',
		placement: 'bottom'
	};

	let user = get(userStorage);

	userStorage.subscribe((value) => (user = value));

	function getAddress(): string {
		const fullAddress = user?.address;

		if (!fullAddress) return '';

		return `${fullAddress.substring(0, 6)}...${fullAddress.substring(fullAddress.length - 6)}`;
	}
</script>

<div use:popup={popupClick}>
	<Avatar
		initials="ME"
		src="https://i.redd.it/2clocwfx2ga71.gif"
		rounded="rounded-full"
		border="border-2 	border-surface-300-600-token hover:!border-secondary-400"
		cursor="cursor-pointer"
		width="w-10"
	/>
</div>

<!-- Dropdown menu -->
<div
	class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
	data-popup="popupClick"
>
	<div class="px-4 py-3 text-sm text-gray-900 dark:text-white">
		<div class="font-medium truncate flex items-center justify-center">{getAddress()}</div>
	</div>
	<!-- <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="avatarButton">
	</ul> -->
	<div class="py-1">
		<button
			class="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
			on:click={disconnect}><strong>Sign out</strong></button
		>
		<!-- <button type="button" class="btn variant-ghost" on:click={disconnect}>Sign Out</button> -->
	</div>
</div>
