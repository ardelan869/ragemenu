import Item, { type ItemProps } from '@/components/item';
import SubTitle from '@/components/sub-title';
import Description from '@/components/description';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useKeyDown } from '@/lib/keys';
import { useNuiEvent } from '@/lib/hooks';

import { cn, debugData, fetchNui, vmin } from '@/lib';

type MenuPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

interface MenuProps {
  id: string;
  resource: string;
  title: string;
  subtitle?: string;
  position?: MenuPosition;
  width?: number;
  maxVisibleItems?: number;
  banner?: string;
}

export default function Menu() {
  const lastMenu = useRef<string | undefined>(undefined);
  const lastSelected = useRef<Record<string, number>>({});
  const [menu, setMenu] = useState<MenuProps | undefined>();
  const [items, setItems] = useState<ItemProps[]>([]);
  const [selected, setSelected] = useState(0);

  useNuiEvent<MenuProps>('UpdateMenu', (menuProps) => {
    setMenu((prevMenu) => {
      if (!prevMenu) return menuProps;

      return {
        ...prevMenu,
        ...menuProps
      };
    });
  });

  useNuiEvent<MenuProps | undefined>('SetMenu', (_menu) => {
    if (menu) lastMenu.current = menu.id;

    setMenu(_menu);
  });

  useNuiEvent<ItemProps[]>('SetItems', setItems);

  useNuiEvent<ItemProps>('AddItem', (item) => {
    setItems((items) => [...(items ?? []), item]);
  });

  useNuiEvent<string>('RemoveItem', (id) => {
    setItems((items) => items?.filter((i) => i.id !== id) ?? []);
  });

  useNuiEvent<ItemProps>('UpdateItem', (item) => {
    const index = items?.findIndex((i) => i.id === item.id);

    if (index === -1) return;

    items[index] = {
      ...items[index],
      ...item
    };

    setItems([...items]);
  });

  const findNextValidIndex = useCallback(
    (direction: 'up' | 'down') => {
      const step = direction === 'up' ? -1 : 1;
      let index = selected;

      do {
        index += step;
        if (index < 0) index = items.length - 1;
        if (index >= items.length) index = 0;

        if (
          items[index].type !== 'separator' &&
          !items[index].disabled &&
          items[index].visible !== false
        ) {
          return index;
        }
      } while (index !== selected);

      return 0;
    },
    [items, selected]
  );

  const arrowUp = useCallback(() => {
    const newIndex = findNextValidIndex('up');
    setSelected(newIndex);
  }, [findNextValidIndex]);
  useKeyDown('ArrowUp', arrowUp);

  const arrowDown = useCallback(() => {
    const newIndex = findNextValidIndex('down');
    setSelected(newIndex);
  }, [findNextValidIndex]);
  useKeyDown('ArrowDown', arrowDown);

  const arrowRight = useCallback(() => {
    const item = items[selected];

    if (item.type === 'separator' || item.disabled || item.visible === false)
      return;

    if (item.type === 'list') {
      if (item.current === item.values.length - 1) item.current = 0;
      else item.current++;
    } else if (item.type === 'slider') {
      if (item.current === item.max) return;

      item.current += Math.min(item.step ?? 1, item.max);
    }

    fetchNui('OnChange', {
      menu,
      selected: items[selected].id,
      current: item.current
    });

    setItems([...items]);
  }, [menu, items, selected]);
  useKeyDown('ArrowRight', arrowRight);

  const arrowLeft = useCallback(() => {
    const item = items[selected];

    if (item.type === 'separator' || item.disabled || item.visible === false)
      return;

    if (item.type === 'list') {
      if (item.current === 0) item.current = item.values.length - 1;
      else item.current--;
    } else if (item.type === 'slider') {
      if (item.current === (item.min ?? 0)) return;

      item.current -= Math.max(item.step ?? 1, item.min ?? 0);
    }

    fetchNui('OnChange', {
      menu,
      selected: items[selected].id,
      current: item.current
    });

    setItems([...items]);
  }, [menu, items, selected]);
  useKeyDown('ArrowLeft', arrowLeft);

  const enter = useCallback(() => {
    const item = items[selected];

    if (item.type === 'separator' || item.disabled || item.visible === false)
      return;

    if (item.type === 'checkbox') {
      item.checked = !item.checked;

      fetchNui('OnCheck', {
        menu,
        selected: item.id,
        checked: item.checked
      });

      return setItems([...items]);
    }

    fetchNui('OnClick', {
      menu,
      selected: item.id
    });
  }, [menu, items, selected]);
  useKeyDown('Enter', enter);

  const escape = useCallback(() => {
    setItems([]);
    setSelected(0);

    fetchNui('Exit', { menu });
  }, [menu]);
  useKeyDown('Escape', escape);
  useKeyDown('Backspace', escape);

  useEffect(() => {
    if (!menu || !items || !items[selected]) return;

    const element = document.getElementById(`item-${items[selected].id}`);

    if (!element || element.dataset?.selected === 'true') return;

    element.scrollIntoView({
      block: 'end'
    });

    const prev = document.querySelector('[data-selected="true"]');

    prev?.removeAttribute('data-selected');

    element.dataset.selected = 'true';

    fetchNui('OnSelect', {
      menu,
      selected: items[selected].id
    });
  }, [selected, menu, items]);

  useEffect(() => {
    if (!menu || menu.id === lastMenu.current) return;

    lastMenu.current = menu.id;

    setSelected(
      lastSelected.current[menu.id] ??
        items?.findIndex(
          (i) =>
            i.type !== 'separator' &&
            i.disabled !== false &&
            i.visible !== false
        ) ??
        0
    );

    delete lastSelected.current[menu.id];
  }, [menu, items]);

  useEffect(() => {
    if (!menu) return;

    lastSelected.current[menu.id] = selected;
  }, [selected, menu]);

  useEffect(() => {
    debugData([
      {
        action: 'SetMenu',
        data: {
          id: 'test',
          resource: 'ragemenu',
          title: 'Test',
          subtitle: 'Test',
          width: 432,
          maxVisibleItems: 10,
          banner: 'https://i.imgur.com/Ua8m2Wq.gif'
        }
      },
      {
        action: 'SetItems',
        data: [
          {
            id: 'test',
            label: 'Test',
            type: 'checkbox',
            checked: true,
            badges: {
              left: 'card_suit_hearts'
            }
          },
          {
            id: 'test2',
            label: 'Test2',
            type: 'button',
            rightLabel: 'Test',
            badges: {
              right: 'card_suit_hearts'
            },
            disabled: true
          },
          {
            id: 'test3',
            label: 'Test3',
            type: 'slider',
            min: 0,
            max: 100,
            step: 1,
            current: 50
          },
          {
            id: 'test4',
            label: 'Long Text Long Text Long Text Long Text',
            type: 'list',
            values: [
              'Long Text Long Text Long Text Long Text Long Text Long Text',
              'Test2',
              'Test3'
            ],
            current: 0
          },
          {
            id: 'test5',
            label: 'Long Text Long Text Long Text Long Text Long Text',
            type: 'separator'
          },
          {
            id: 'test6',
            label: 'Imaginary Submenu IIII',
            type: 'button',
            badges: {
              right: 'arrowright'
            }
          },
          {
            id: 'test7',
            label: 'Test7',
            type: 'button',
            rightLabel: 'Test'
          }
        ]
      }
    ]);
  }, []);

  return (
    !!menu &&
    !!items &&
    !!items.length && (
      <main
        className={cn(
          'absolute m-[2.2222vmin] w-[40vmin] font-chalet text-[1.8519vmin] font-black tracking-[0.0926vmin]',
          menu.position ?? 'top-left'
        )}
        style={{ width: vmin(menu.width || 432) }}
      >
        <header
          className={cn(
            'grid h-[11.8519vmin] w-full place-items-center bg-header-gradient',
            !!menu.banner && 'bg-cover bg-center bg-no-repeat'
          )}
          style={menu.banner ? { backgroundImage: `url(${menu.banner})` } : {}}
        >
          <h1 className="translate-y-[0.7407vmin] font-signpainter text-[6.6667vmin] font-extralight text-white">
            {menu.title}
          </h1>
        </header>
        {menu.subtitle && <SubTitle>{menu.subtitle}</SubTitle>}
        <section
          className="overflow-y-scroll"
          style={{ maxHeight: vmin((menu.maxVisibleItems || 10) * 38) }}
        >
          {items?.map((item, index) => (
            <Item key={item.id} {...item} selected={index === selected}>
              <Item.Text
                className={item.type === 'separator' ? 'pr-0' : 'mr-auto'}
              >
                {item.label}
              </Item.Text>
            </Item>
          ))}
        </section>
        {items[selected]?.description?.trim?.().length && (
          <Description>{items[selected].description}</Description>
        )}
      </main>
    )
  );
}
