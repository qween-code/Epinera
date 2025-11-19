// Search History Management with LocalStorage

const SEARCH_HISTORY_KEY = 'epinera_search_history';
const MAX_HISTORY_ITEMS = 10;

export interface SearchHistoryItem {
    query: string;
    timestamp: number;
}

export class SearchHistory {
    static getHistory(): SearchHistoryItem[] {
        if (typeof window === 'undefined') return [];

        try {
            const history = localStorage.getItem(SEARCH_HISTORY_KEY);
            return history ? JSON.parse(history) : [];
        } catch {
            return [];
        }
    }

    static addSearch(query: string): void {
        if (typeof window === 'undefined' || !query.trim()) return;

        const history = this.getHistory();
        const newItem: SearchHistoryItem = {
            query: query.trim(),
            timestamp: Date.now(),
        };

        // Remove duplicate if exists
        const filtered = history.filter(item => item.query.toLowerCase() !== query.toLowerCase());

        // Add to beginning and limit to MAX_HISTORY_ITEMS
        const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);

        try {
            localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
        } catch (error) {
            console.error('Failed to save search history:', error);
        }
    }

    static clearHistory(): void {
        if (typeof window === 'undefined') return;

        try {
            localStorage.removeItem(SEARCH_HISTORY_KEY);
        } catch (error) {
            console.error('Failed to clear search history:', error);
        }
    }

    static removeItem(query: string): void {
        if (typeof window === 'undefined') return;

        const history = this.getHistory();
        const filtered = history.filter(item => item.query !== query);

        try {
            localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(filtered));
        } catch (error) {
            console.error('Failed to remove search history item:', error);
        }
    }
}
