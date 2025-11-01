import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',

      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'dark' ? 'light' : 'dark';

          // Update document class
          if (typeof document !== 'undefined') {
            document.documentElement.classList.remove('dark', 'light');
            document.documentElement.classList.add(newTheme);
          }

          return { theme: newTheme };
        }),

      setTheme: (theme) => {
        // Update document class
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('dark', 'light');
          document.documentElement.classList.add(theme);
        }

        set({ theme });
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);
