import { cn } from '@/lib';
import { useItem } from '@/components/item.hooks';
import type { SliderProps } from '@/components/item';

export default function Slider({
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLElement>, 'children'>) {
  const {
    selected,
    disabled = false,
    current = 0,
    max
  } = useItem() as SliderProps;

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
      <div className="h-[0.8333vmin] w-[13.8889vmin] overflow-hidden bg-[#042039]">
        <div
          className="h-full bg-[#3974C8]"
          style={{ width: `${(current / max) * 100}%` }}
        />
      </div>
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
