<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import EmailBlastForm from './modal/EmailBlastForm.svelte';
	import { 
		registrantStore, 
		searchQuery, 
		filterStatus, 
		currentPage, 
	} from '$lib/stores/index';	
	import { downloadCSV } from '$lib/utils/csv';
	import { derived } from 'svelte/store';

	let { data } = $props();

	// Initialize stores with data
	$effect(() => {
		registrantStore.set(data.guestList);
	});

	// Filtered guests based on search and status
	const filteredGuests = derived(
		[registrantStore, searchQuery, filterStatus],
		([$registrantStore, $searchQuery, $filterStatus]) => 
			$registrantStore.filter(guest => 
				($filterStatus === 'all' || guest.status === $filterStatus) &&
				(guest.name.toLowerCase().includes($searchQuery.toLowerCase()) ||
				guest.email.toLowerCase().includes($searchQuery.toLowerCase()))
			)
	);

	function handleFilterStatusChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		filterStatus.set(select.value);
		currentPage.set(1);
	}

	function handleSearch(event: Event) {
		const input = event.target as HTMLInputElement;
		searchQuery.set(input.value);
		currentPage.set(1);
	}


	function handleDownloadCSV() {
		downloadCSV($filteredGuests);
	}
	
	function openQrCodeModal(guest: any) {
		// Define the function logic here
		console.log('Opening QR Code Modal for:', guest);
	}
</script>

<div class="space-y-8">
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		<Card icon="fa-solid fa-users text-blue" iconText="Guests" content="250">
			<Modal>
				{#snippet button()}
					<h1 class="text-primary cursor-pointer text-sm">Email Blast</h1>
				{/snippet}
				{#snippet content()}
					<EmailBlastForm />
				{/snippet}
			</Modal>
		</Card>
		<Card icon="fa-solid fa-dollar-sign text-green" iconText="Income" content="₱32,550.00">
			<Modal>
				{#snippet button()}
					<h1 class="text-green cursor-pointer text-sm">View Breakdown</h1>
				{/snippet}
				{#snippet header()}
					<div>View Breakdown Header</div>
				{/snippet}
				{#snippet content()}
					<div>List the Breakdown here</div>
				{/snippet}
			</Modal>
		</Card>
	</div>

	<div class="rounded-xl border border-gray-200 shadow-sm sm:p-6">
		<div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
			<h2 class="text-xl font-semibold text-gray-900">Guest List</h2>
			<div class="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-4">
				<Button
					onClick={handleDownloadCSV}
					label="Download CSV"
					className="bg-gray-100 px-4 py-2 hover:bg-gray-200 rounded-lg"
				/>
				<Button
					onClick={() => {}}
					label="See full list"
					className="bg-primary text-white px-4 py-2 rounded-lg"
				/>
			</div>
		</div>

		<div class="mb-6 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
			<div class="relative flex-1">
				<input
					type="text"
					placeholder="Search guests..."
					oninput={handleSearch}
					class="focus:ring-blue w-full rounded-lg border border-gray-200 bg-gray-50 px-10 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 sm:text-base"
				/>
				<i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 h-5 w-5 text-gray-400"></i>
			</div>
			<div class="flex flex-col gap-2 sm:flex-row sm:gap-4">
				<select
					onchange={handleFilterStatusChange}
					class="focus:ring-blue cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 sm:text-base"
				>
					<option value="all">All Guests</option>
					<option value="registered">Registered</option>
					<option value="pending">Pending</option>
				</select>
				<select
					class="focus:ring-blue cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 sm:text-base"
				>
					<option value="name">Name, Email...</option>
					<option value="date">Registration Date</option>
					<option value="status">Status</option>
				</select>
			</div>
		</div>

		<!-- Guest List Items -->
		<div class="space-y-4">
			{#each $filteredGuests as guest (guest.id)}
				<Modal dialogClass="w-full">
					{#snippet button()}
						<div
							class="flex cursor-pointer flex-col justify-between gap-4 rounded-lg bg-gray-100 p-4 transition-colors hover:bg-gray-300 sm:flex-row sm:items-center"
						>
							<div class="flex items-center gap-4 text-left">
								<img src={guest.avatar} alt={guest.name} class="h-10 w-10 rounded-full" />
								<div>
									<h3 class="font-medium text-gray-900">{guest.name}</h3>
									<p class="text-sm text-gray-500">{guest.email}</p>
								</div>
							</div>
							<div class="flex flex-wrap items-center justify-between gap-2 sm:justify-end sm:gap-4">
								<span class="order-1 text-sm text-gray-500 sm:order-none">
									{guest.registrationDate}
								</span>
								<span
									class={`rounded-full px-3 py-1 text-xs font-medium ${
										guest.status === 'registered'
											? 'bg-green-100 text-green-700'
											: 'bg-yellow-100 text-yellow-700'
									} order-2 sm:order-none`}
								>
									{guest.status}
								</span>
								<button 
								class={`px-3 py-2 rounded-lg transition-colors text-xs flex items-center gap-2 order-3 sm:order-none ${
								  guest.status === 'pending' 
									? 'bg-[#E2E2E2] text-[#B7B7B7] cursor-not-allowed' 
									: 'text-red-500 hover:border-red-600 hover:bg-red-200 hover:text-red-600 border-1 cursor-pointer'
								}`}
								disabled={guest.status === 'pending'}
								
							  >
								<svg 
								  xmlns="http://www.w3.org/2000/svg" 
								  width="20" 
								  height="20" 
								  viewBox="0 0 24 24" 
								  fill="currentColor" 
								  class="w-4 h-4 sm:hidden"
								>
								  <path d="M3 4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h10.5a6.5 6.5 0 0 1-.5-2.5a6.5 6.5 0 0 1 6.5-6.5a6.5 6.5 0 0 1 1.5.18V6a2 2 0 0 0-2-2zm0 2l8 5l8-5v2l-8 5l-8-5zm16 6l-2.25 2.25L19 16.5V15a2.5 2.5 0 0 1 2.5 2.5c0 .4-.09.78-.26 1.12l1.09 1.09c.42-.63.67-1.39.67-2.21c0-2.21-1.79-4-4-4zm-3.33 3.29c-.42.63-.67 1.39-.67 2.21c0 2.21 1.79 4 4 4V23l2.25-2.25L19 18.5V20a2.5 2.5 0 0 1-2.5-2.5c0-.4.09-.78.26-1.12z"/>
								</svg>
								<svg 
								  xmlns="http://www.w3.org/2000/svg" 
								  viewBox="0 0 24 24" 
								  fill="currentColor" 
								  class="hidden sm:inline w-5 h-5"
								>
								  <path d="M1.94607 9.31543C1.42353 9.14125 1.4194 8.86022 1.95682 8.68108L21.043 2.31901C21.5715 2.14285 21.8746 2.43866 21.7265 2.95694L16.2733 22.0432C16.1223 22.5716 15.8177 22.59 15.5944 22.0876L11.9999 14L17.9999 6.00005L9.99992 12L1.94607 9.31543Z"></path>
								</svg>
								<span class="hidden sm:inline">Resend QR Code</span>
								
							  </button>
							</div>
						</div>
					{/snippet}
					{#snippet content()}
						<div class="mb-2 text-gray-500">Additional Info</div>
						<div class="grid grid-cols-1 gap-5">
							<div>
								<p class="font-medium">First Name</p>
								<p>{guest.name}</p>
							</div>
							<div>
								<p class="font-medium">Email</p>
								<p>{guest.email}</p>
							</div>
							<div>
								<p class="font-medium">Date Registered</p>
								<p>{guest.registrationDate}</p>
							</div>
							<div>
								<p class="font-medium">Status</p>
								<p>{guest.status}</p>
							</div>
							<div class="flex justify-between gap-5">
								<Button
									label="Resend Email"
									className="bg-gray-300 w-full p-2 rounded-lg"
							/>

								<Button
									onClick={() => {}}
									label="Check-In"
									className="bg-primary w-full p-2 text-white rounded-lg"
								/>
							</div>
						</div>
					{/snippet}
				</Modal>
			{/each}
			<div class="pb-5 sm:pb-0">
				<Pagination total={300} />
			</div>
		</div>
	</div>
</div>
