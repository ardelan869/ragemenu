import { cn } from '@/lib';
import { useItem } from '@/components/item.hooks';
import type { SliderProps } from '@/components/item';

export default function Slider({
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLElement>, 'children'>) {
  const { selected, current = 0 } = useItem() as SliderProps;

  return (
    <div
      className={cn('ml-auto flex items-center gap-1', className)}
      {...props}
    >
      <img
        className={cn('w-2 h-2 object-contain', selected && 'invert')}
        src="assets/images/arrowleft.png"
      />
      <div className="bg-[#042039] w-[150px] h-[9px] overflow-hidden">
        <div className="bg-[#3974C8] h-full" style={{ width: `${current}%` }} />
      </div>
      <img
        className={cn('w-2 h-2 object-contain', selected && 'invert')}
        src="assets/images/arrowright.png"
      />
    </div>
  );
}
