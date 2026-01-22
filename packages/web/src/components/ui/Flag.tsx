import { useState, memo } from 'react';
import { cn } from '@/lib/utils';

interface FlagProps {
  countryCode: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fallbackColor?: string;
  className?: string;
}

const sizeClasses = {
  xs: 'w-3 h-2.5',
  sm: 'w-4 h-3',
  md: 'w-5 h-4',
  lg: 'w-6 h-5',
};

// Flag SVGs are bundled in /flags directory
const getFlagUrl = (code: string): string => {
  return `/flags/${code.toLowerCase()}.svg`;
};

export const Flag = memo(function Flag({
  countryCode,
  size = 'sm',
  fallbackColor = '#94a3b8',
  className,
}: FlagProps) {
  const [hasError, setHasError] = useState(false);
  const code = countryCode.toUpperCase();

  if (hasError) {
    // Fallback to color dot
    return (
      <span
        className={cn('rounded-full flex-shrink-0', sizeClasses[size], className)}
        style={{ backgroundColor: fallbackColor }}
        title={code}
      />
    );
  }

  return (
    <img
      src={getFlagUrl(code)}
      alt={`${code} flag`}
      className={cn(
        'rounded-sm flex-shrink-0 object-cover',
        sizeClasses[size],
        className
      )}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
});

// Preload flags for better UX
export function preloadFlags(countryCodes: string[]): void {
  if (typeof window === 'undefined') return;
  countryCodes.forEach(code => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'image';
    link.href = getFlagUrl(code);
    document.head.appendChild(link);
  });
}
