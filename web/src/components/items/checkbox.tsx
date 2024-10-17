import { cn } from '@/lib';
import { useItem } from '@/components/item.hooks';

const IMG_SRC = {
  cross: 'assets/images/shop_box_cross.png',
  tick: 'assets/images/shop_box_tick.png'
} as const;

export default function Checkbox({
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const {
    selected,
    disabled = false,
    checked = false,
    iconStyle = 'tick'
  } = useItem();

  return (
    <img
      className={cn(
        'ml-auto h-[1.8519vmin] w-[1.8519vmin]',
        selected && 'invert',
        disabled && 'opacity-50',
        className
      )}
      {...props}
      src={checked ? IMG_SRC[iconStyle] : 'assets/images/shop_box_blank.png'}
    />
  );
}
