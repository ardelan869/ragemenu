import type { ListProps } from '@/components/item';

import { cn } from '@/lib';
import { useItem } from '@/components/item.hooks';

import ColoredText from '@/components/colored-text';

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
        'ml-auto flex items-center gap-[0.3704vmin]',
        disabled && 'opacity-50',
        className
      )}
      {...props}
    >
      <img
        className={cn(
          'h-[0.7407vmin] w-[0.7407vmin] object-contain',
          selected && 'invert'
        )}
        src="assets/images/arrowleft.png"
      />
      <h3 className="max-w-[13.8889vmin] truncate">
        <ColoredText>{values[current]}</ColoredText>
      </h3>
      <img
        className={cn(
          'h-[0.7407vmin] w-[0.7407vmin] object-contain',
          selected && 'invert'
        )}
        src="assets/images/arrowright.png"
      />
    </div>
  );
}
