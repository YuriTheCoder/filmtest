import { X } from 'lucide-react';
import { Genre } from '@/types/movie';
import { cn } from '@/lib/utils';

interface GenreChipProps {
  genre: Genre;
  removable?: boolean;
  onRemove?: (genreId: string) => void;
  className?: string;
}

export default function GenreChip({
  genre,
  removable = false,
  onRemove,
  className,
}: GenreChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm',
        'bg-bg-secondary border border-white/10',
        'hover:border-accent-primary/50 transition-colors',
        className
      )}
    >
      {genre.name}
      {removable && onRemove && (
        <button
          onClick={() => onRemove(genre.id)}
          className="ml-1 hover:text-accent-primary transition-colors"
          aria-label={`Remove ${genre.name}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
