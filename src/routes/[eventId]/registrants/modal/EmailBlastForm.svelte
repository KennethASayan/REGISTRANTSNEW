<script lang="ts">
	import { registrantStore } from '$lib/stores/index';
	import { Dialog } from 'bits-ui';
	import ScheduleDatePicker from '$lib/components/ui/ScheduleDatePicker.svelte';
  
	// State management using $state
	let state = $state({
	  showSchedule: false,
	  message: '',
	  guestSearchQuery: '',
	  scheduleDate: null,
	  scheduleTime: '',
	  timezone: 'GMT+08:00 Manila',
	  showGuestSearch: false,
	  selectedGuests: [] as Guest[],
	});
  
	// Derived state for filtered guests
	let filteredGuests = $derived(() => filterGuests(state.guestSearchQuery));
  
	// Functions
	function toggleSchedule() {
	  state.showSchedule = !state.showSchedule;
	}
  
	function toggleGuestSearch() {
	  state.showGuestSearch = !state.showGuestSearch;
	}
  
	function selectGuest(guest: Guest) {
	  if (!state.selectedGuests.find((g) => g.id === guest.id)) {
		state.selectedGuests = [...state.selectedGuests, guest];
	  }
	  state.guestSearchQuery = '';
	  state.showGuestSearch = false;
	}
  
	function removeGuest(guestId: string) {
	  state.selectedGuests = state.selectedGuests.filter((g) => g.id !== guestId);
	}
  
	async function sendBlast() {
	  if (state.selectedGuests.length === 0) {
		alert('Please select at least one recipient');
		return;
	  }
  
	  if (!state.message.trim()) {
		alert('Please enter a message');
		return;
	  }
  
	  if (state.showSchedule && (!state.scheduleDate || !state.scheduleTime)) {
		alert('Please select both date and time for scheduling');
		return;
	  }
  
	  const blastData = {
		recipients: state.selectedGuests.map((g) => g.id),
		message: state.message,
		scheduleDate: state.showSchedule ? state.scheduleDate : null,
		scheduleTime: state.showSchedule ? state.scheduleTime : null,
		timezone: state.showSchedule ? state.timezone : null,
	  };
  
	  console.log('Sending blast:', blastData);
	}
  
	function filterGuests(query: string): Guest[] {
	  const lowerCaseQuery = query.toLowerCase();
	  return $registrantStore.filter(
		(guest) =>
		  guest.name.toLowerCase().includes(lowerCaseQuery) ||
		  guest.email.toLowerCase().includes(lowerCaseQuery)
	  );
	}
  </script>
  
  <div class="p-4 sm:p-6">
	<div class="flex w-full items-center justify-between text-lg font-semibold tracking-tight mb-4 sm:mb-6">
	  <div class="flex items-center gap-2 sm:gap-3">
		<div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 sm:h-10 sm:w-10">
		  <i class="fa-solid fa-envelope text-gray-500" />
		</div>
		<div>
		  <h2 class="text-lg font-semibold text-gray-800 sm:text-xl">Send Blast</h2>
		  <p class="mt-0.5 text-xs text-gray-500 sm:mt-1 sm:text-sm">
			Guests will receive the blast via email, SMS or in-app notification.
		  </p>
		</div>
		<Dialog.Close class="cursor-pointer p-2 text-gray-500">
		  <i class="fa-solid fa-xmark" />
		</Dialog.Close>
	  </div>
	</div>
  
	<form class="space-y-5">
	  <div class="space-y-2">
		<label for="recipients" class="block text-sm font-medium text-gray-700">Recipients</label>
		<div class="relative">
		  <input
			type="text"
			id="recipients"
			placeholder="Search guests..."
			bind:value={state.guestSearchQuery}
			on:focus={toggleGuestSearch}
			class="w-full rounded-lg border border-gray-300 bg-white p-2 pl-9 text-sm shadow-sm outline-none sm:p-2.5 sm:pl-10"
		  />
		  <i class="fa-solid fa-magnifying-glass absolute left-2.5 top-2.5 text-gray-400 sm:left-3 sm:top-3" />
  
		  {#if state.showGuestSearch && state.guestSearchQuery.length > 0}
			<div class="absolute z-10 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-lg">
			  <div class="max-h-36 overflow-y-auto sm:max-h-48">
				{#each filteredGuests as guest}
				  <button
					type="button"
					class="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100 sm:gap-3 sm:px-4"
					on:click={() => selectGuest(guest)}
				  >
					<img src={guest.avatar} alt={guest.name} class="h-6 w-6 rounded-full sm:h-8 sm:w-8" />
					<div>
					  <div class="text-sm font-medium">{guest.name}</div>
					  <div class="text-xs text-gray-500">{guest.email}</div>
					</div>
				  </button>
				{/each}
			  </div>
			</div>
		  {/if}
		</div>
  
		{#if state.selectedGuests.length > 0}
		  <div class="mt-2 flex flex-wrap gap-2">
			{#each state.selectedGuests as guest}
			  <div class="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm">
				<img src={guest.avatar} alt={guest.name} class="h-5 w-5 rounded-full" />
				<span>{guest.name}</span>
				<button
				  type="button"
				  class="ml-1 text-gray-500 hover:text-gray-700"
				  on:click={() => removeGuest(guest.id)}
				>
				  <i class="fa-solid fa-times" />
				</button>
			  </div>
			{/each}
		  </div>
		{/if}
	  </div>
  
	  <div class="space-y-2">
		<label for="message" class="block text-sm font-medium text-gray-700">Message</label>
		<textarea
		  id="message"
		  bind:value={state.message}
		  rows="4"
		  class="w-full resize-none rounded-lg border border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:p-2.5"
		  placeholder="Type your message..."
		/>
	  </div>
  
	  {#if state.showSchedule}
		<ScheduleDatePicker
		  scheduleDate={state.scheduleDate}
		  scheduleTime={state.scheduleTime}
		  timezone={state.timezone}
		/>
	  {/if}
  
	  <div class="flex flex-col gap-3 sm:flex-row sm:justify-between">
		<div>
		  <Dialog.Close class="cursor-pointer rounded-lg bg-gray-400 px-4 py-2 text-white">Cancel</Dialog.Close>
		</div>
		<div class="flex flex-col gap-3 sm:flex-row">
		  <button
			type="button"
			class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-2 text-white sm:w-32"
			on:click={toggleSchedule}
		  >
			<i class="fa-regular fa-clock" />
			Schedule
		  </button>
		  <button
			type="button"
			class="w-full cursor-pointer rounded-lg bg-blue-600 py-2 text-white sm:w-32"
			on:click={sendBlast}
		  >
			{state.showSchedule ? 'Schedule Blast' : 'Send Now'}
		  </button>
		</div>
	  </div>
	</form>
  </div>