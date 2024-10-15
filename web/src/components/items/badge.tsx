import { cn } from '@/lib';
import { useItem } from '@/components/item.hooks';

export type BadgeName =
  | 'card_suit_clubs'
  | 'card_suit_diamonds'
  | 'card_suit_hearts'
  | 'card_suit_spades'
  | 'medal_bronze'
  | 'medal_gold'
  | 'medal_silver'
  | 'mp_alerttriangle'
  | 'mp_hostcrown'
  | 'mp_medal_bronze'
  | 'mp_medal_gold'
  | 'mp_medal_silver'
  | 'mp_specitem_cash'
  | 'mp_specitem_coke'
  | 'mp_specitem_heroin'
  | 'mp_specitem_meth'
  | 'mp_specitem_weed'
  | 'shop_ammo_icon'
  | 'shop_armour_icon'
  | 'shop_art_icon'
  | 'shop_barber_icon'
  | 'shop_chips'
  | 'shop_clothing_icon'
  | 'shop_franklin_icon'
  | 'shop_garage_bike_icon'
  | 'shop_garage_icon'
  | 'shop_gunclub_icon'
  | 'shop_health_icon'
  | 'shop_lock'
  | 'shop_lock_arena'
  | 'shop_makeup_icon'
  | 'shop_mask_icon'
  | 'shop_michael_icon'
  | 'shop_new_star'
  | 'shop_tattoos_icon'
  | 'shop_tick_icon'
  | 'shop_trevor_icon'
  | 'arrowright'
  | 'arrowleft'
  | 'shop_box_blank'
  | 'shop_box_tick'
  | 'shop_box_cross';

export default function Badge({
  name,
  align = 'left',
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & {
  name: BadgeName;
  align?: 'left' | 'right';
}) {
  const { selected, disabled = false } = useItem();

  if (!name) return null;

  return (
    <img
      className={cn(
        'w-5 h-5 object-contain',
        align === 'left' ? 'mr-1' : 'ml-1',
        selected && 'invert',
        disabled && name !== 'shop_lock' && 'opacity-50',
        className
      )}
      {...props}
      src={`assets/images/${name}.png`}
    />
  );
}
