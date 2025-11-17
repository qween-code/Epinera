import { create } from 'zustand';
import { getWallet, getTransactions } from '@/app/actions/wallet';

interface Wallet {
    balance: number;
    currency: string;
}

interface Transaction {
    id: string;
    created_at: string;
    type: 'deposit' | 'purchase' | 'withdrawal' | 'refund';
    amount: number;
    currency: string;
    description: string;
}

interface WalletState {
    wallet: Wallet | null;
    transactions: Transaction[];
    fetchWallet: () => Promise<void>;
    fetchTransactions: () => Promise<void>;
}

const useWalletStore = create<WalletState>((set) => ({
    wallet: null,
    transactions: [],
    fetchWallet: async () => {
        const walletData = await getWallet();
        if (walletData) {
            set({ wallet: walletData });
        }
    },
    fetchTransactions: async () => {
        const transactionsData = await getTransactions();
        if (transactionsData) {
            set({ transactions: transactionsData });
        }
    },
}));

export default useWalletStore;
