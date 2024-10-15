import type { BadgeName } from '@/components/items/badge';

import { cn } from '@/lib';
import { createContext } from 'react';

import Checkbox from '@/components/items/checkbox';
import List from '@/components/items/list';
import Slider from '@/components/items/slider';
import Badge from '@/components/items/badge';

export type ItemType = 'button' | 'checkbox' | 'separator' | 'list' | 'slider';

export interface BaseProps {
  id: string;
  selected?: boolean;
  type: ItemType;
  label: string;
  rightLabel?: string;
  description?: string;
  badges?: {
    left?: BadgeName;
    right?: BadgeName;
  };
  disabled?: boolean;
  visible?: boolean;
  values?: string[];
  checked?: boolean;
  current?: number;
  iconStyle?: 'cross' | 'tick';
  max?: number;
  min?: number;
}

export interface ButtonProps extends BaseProps {
  type: 'button';
}

export interface CheckboxProps extends BaseProps {
  type: 'checkbox';
}

export interface SeparatorProps extends BaseProps {
  type: 'separator';
}

export interface ListProps extends BaseProps {
  type: 'list';
  values: string[];
  current: number;
}

export interface SliderProps extends BaseProps {
  type: 'slider';
  current: number;
  max: number;
  min?: number;
  step?: number;
}

export type ItemProps =
  | ButtonProps
  | CheckboxProps
  | SeparatorProps
  | ListProps
  | SliderProps;

export const ItemContext = createContext<ItemProps>({
  id: '',
  type: 'button',
  label: '',
  selected: false
});

function Item({
  id,
  selected = false,
  type,
  label,
  description,
  badges,
  disabled = false,
  visible = true,
  checked = false,
  values = [],
  current = 0,
  iconStyle = 'tick',
  max,
  min = 0,
  className,
  children,
  rightLabel,
  ...props
}: React.HTMLAttributes<HTMLElement> & ItemProps) {
  // FIXME: Maybe make this a bit more readable
  if (!visible) return null;

  return (
    <ItemContext.Provider
      value={
        {
          id,
          selected,
          type,
          label,
          description,
          badges,
          disabled,
          visible,
          checked,
          values,
          current,
          iconStyle,
          max,
          min,
          className,
          children,
          rightLabel
        } as ItemProps
      }
    >
      <section
        id={`item-${id}`}
        className={cn(
          'h-[38px] px-[10px] py-1 flex items-center',
          selected
            ? 'bg-selected-item-gradient text-black'
            : 'bg-[#0A0A0A]/50 text-white',
          type === 'separator' && 'justify-center',
          disabled && 'text-opacity-50',
          className
        )}
        {...props}
      >
        {badges?.left && <Badge name={badges.left} align="left" />}
        {children}
        {/* Had to do it here, otherwise i would have gotten an error about an invalid prop */}
        {rightLabel && (
          <Item.Text className="justify-self-end">{rightLabel}</Item.Text>
        )}
        {type === 'list' && <List />}
        {type === 'slider' && <Slider />}
        {type === 'checkbox' && <Checkbox />}
        {badges?.right && <Badge name={badges?.right} align="right" />}
        {disabled && <Badge name="shop_lock" align="right" />}
      </section>
    </ItemContext.Provider>
  );
}

function Text({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 {...props} />;
}

Item.Text = Text;

export default Item;
