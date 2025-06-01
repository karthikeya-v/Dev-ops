import { cn } from '../../lib/utils';
import * as LabelPrimitive from '@radix-ui/react-label';
import { forwardRef } from 'react';

const Label = forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "block text-sm font-medium text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1",
      className
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label }; 