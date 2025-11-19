// Theme configuration and utilities
export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor = 'blue' | 'purple' | 'green' | 'orange' | 'pink';

export interface ThemeConfig {
    mode: ThemeMode;
    accentColor: AccentColor;
    fontSize: 'sm' | 'md' | 'lg';
    compactMode: boolean;
}

const THEME_STORAGE_KEY = 'epinera_theme';

export const defaultTheme: ThemeConfig = {
    mode: 'dark',
    accentColor: 'blue',
    fontSize: 'md',
    compactMode: false,
};

export const accentColors = {
    blue: '#3B82F6',
    purple: '#A855F7',
    green: '#10B981',
    orange: '#F97316',
    pink: '#EC4899',
};

export class ThemeManager {
    static getTheme(): ThemeConfig {
        if (typeof window === 'undefined') return defaultTheme;

        try {
            const stored = localStorage.getItem(THEME_STORAGE_KEY);
            return stored ? { ...defaultTheme, ...JSON.parse(stored) } : defaultTheme;
        } catch {
            return defaultTheme;
        }
    }

    static saveTheme(theme: Partial<ThemeConfig>): void {
        if (typeof window === 'undefined') return;

        try {
            const current = this.getTheme();
            const updated = { ...current, ...theme };
            localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(updated));
            this.applyTheme(updated);
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    }

    static applyTheme(theme: ThemeConfig): void {
        if (typeof window === 'undefined') return;

        const root = document.documentElement;

        // Apply mode
        if (theme.mode === 'dark' || (theme.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        // Apply accent color
        root.style.setProperty('--color-primary', accentColors[theme.accentColor]);

        // Apply font size
        const fontSizes = { sm: '14px', md: '16px', lg: '18px' };
        root.style.setProperty('--font-size-base', fontSizes[theme.fontSize]);

        // Apply compact mode
        if (theme.compactMode) {
            root.classList.add('compact');
        } else {
            root.classList.remove('compact');
        }
    }

    static initialize(): void {
        const theme = this.getTheme();
        this.applyTheme(theme);

        // Listen for system theme changes
        if (theme.mode === 'system') {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
                this.applyTheme(theme);
            });
        }
    }
}
