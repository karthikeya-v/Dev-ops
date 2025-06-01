import { cn } from '../../lib/utils';
import { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'default' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all duration-150 ease-in-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          'whitespace-nowrap',
          // Sizes
          size === 'sm' && 'px-3 h-8 text-xs',
          size === 'default' && 'px-4 py-2 h-10',
          size === 'lg' && 'px-6 h-12 text-base',
          // Default variant (primary action)
          variant === 'default' &&
            'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-sm hover:shadow-md',
          // Destructive variant
          variant === 'destructive' &&
            'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm hover:shadow-md',
          // Outline variant
          variant === 'outline' &&
            'border border-indigo-600 text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100',
          // Secondary variant
          variant === 'secondary' &&
            'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 active:bg-indigo-300',
          // Ghost variant
          variant === 'ghost' && 'hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200',
          // Link variant
          variant === 'link' && 'text-indigo-600 underline-offset-4 hover:underline h-auto px-0 py-0', // Links don't need padding/height like buttons
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
