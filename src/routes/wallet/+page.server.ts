import { walletTransactions } from '$lib/stores/data';

export const load = async () => {
	return {
		walletTransactions
	};
};

export const actions = {
	searchWalletTransaction: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	},

	walletWithdrawal: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	},

	walletIncomeBreakdown: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	}
};
