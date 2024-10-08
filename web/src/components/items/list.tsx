import type { ListProps } from '@/components/item';

import { cn } from '@/lib';
import { useItem } from '@/components/item.hooks';

export default function List({
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLElement>, 'children'>) {
  const {
    selected,
    disabled = false,
    values = [],
    current = 0
  } = useItem() as ListProps;

  return (
    <div
      className={cn(
        'ml-auto flex items-center gap-1',
        disabled && 'opacity-50',
        className
      )}
      {...props}
    >
      <img
        className={cn('w-2 h-2 object-contain', selected && 'invert')}
        src="assets/images/arrowleft.png"
      />
      <h3>{values[current]}</h3>
      <img
        className={cn('w-2 h-2 object-contain', selected && 'invert')}
        src="assets/images/arrowright.png"
      />
    </div>
  );
}
