import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn, debounce } from '@/lib/utils';

interface SearchInputProps {
  placeholder?: string;
  defaultValue?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
  className?: string;
}

export default function SearchInput({
  placeholder = 'Search...',
  defaultValue = '',
  onSearch,
  debounceMs = 300,
  className,
}: SearchInputProps) {
  const [value, setValue] = useState(defaultValue);

  // Debounced search function
  useEffect(() => {
    const debouncedSearch = debounce((query: string) => {
      onSearch(query);
    }, debounceMs);

    debouncedSearch(value);
  }, [value, debounceMs, onSearch]);

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 rounded-lg bg-bg-card border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-colors"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
          aria-label="Clear search"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
