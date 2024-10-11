import Item, { type ItemProps } from '@/components/item';
import SubTitle from '@/components/sub-title';
import Description from '@/components/description';

import { useEffect, useState } from 'react';
import { useKeyDown } from '@/lib/keys';
import { useNuiEvent } from '@/lib/hooks';
import { debugData, fetchNui, findLastIndex } from '@/lib';

interface MenuProps {
  id: string;
  resource: string;
  title: string;
  subtitle?: string;
  width?: number;
  maxVisibleItems?: number;
}

export default function Menu() {
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

  useNuiEvent<MenuProps | undefined>('SetMenu', setMenu);

  useNuiEvent<ItemProps[]>('SetItems', setItems);

  useNuiEvent<ItemProps>('AddItem', (item) => {
    setItems([...items, item]);
  });

  useNuiEvent<string>('RemoveItem', (id) => {
    setItems((items) => items.filter((i) => i.id !== id));
  });

  useNuiEvent<ItemProps>('UpdateItem', (item) => {
    const index = items.findIndex((i) => i.id === item.id);

    if (index === -1) return;

    items[index] = {
      ...items[index],
      ...item
    };

    setItems([...items]);
  });

  function ArrowUp() {
    let index = Math.max(-1, selected - 1);

    if (items[index]?.type === 'separator' || items[index]?.disabled) index--;

    if (index < 0)
      index = findLastIndex(
        items,
        (c) => !c.disabled && c.visible !== false && c.type !== 'separator'
      );

    setSelected(index);
  }
  useKeyDown('ArrowUp', ArrowUp);

  function ArrowDown() {
    let index = Math.min(items.length, selected + 1);

    if (items[index]?.type === 'separator' || items[index]?.disabled)
      index += 1;

    if (index === items.length)
      index = items.findIndex(
        (c) => !c.disabled && c.visible !== false && c.type !== 'separator'
      );

    if (index < 0) return;

    setSelected(index);
  }
  useKeyDown('ArrowDown', ArrowDown);

  function ArrowRight() {
    const item = items[selected];

    if (item.type === 'separator' || item.disabled || item.visible !== true)
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
  }
  useKeyDown('ArrowRight', ArrowRight);

  function ArrowLeft() {
    const item = items[selected];

    if (item.type === 'separator' || item.disabled || item.visible !== true)
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
  }
  useKeyDown('ArrowLeft', ArrowLeft);

  function Enter() {
    const item = items[selected];

    if (item.type === 'separator' || item.disabled || item.visible !== true)
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
  }
  useKeyDown('Enter', Enter);

  function Escape() {
    setItems([]);
    setSelected(0);

    fetchNui('Exit', { menu });
  }
  useKeyDown('Escape', Escape);
  useKeyDown('Backspace', Escape);

  useEffect(() => {
    if (!menu || !items || !items[selected]) return;

    document.getElementById(`item-${items[selected].id}`)?.scrollIntoView({
      block: 'center'
    });

    fetchNui('OnSelect', {
      menu,
      selected: items[selected].id
    });
  }, [selected, menu, items]);

  useEffect(() => {
    debugData([
      {
        action: 'SetMenu',
        data: {
          id: 'test',
          resource: 'ragemenu',
          title: 'Test',
          width: 432,
          maxVisibleItems: 10
        }
      },
      {
        action: 'SetItems',
        data: [
          {
            id: 'test',
            label: 'Test',
            type: 'checkbox',
            checked: true
          },
          {
            id: 'test2',
            label: 'Test2',
            type: 'button',
            rightLabel: 'Test'
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
            label: 'Test4',
            type: 'list',
            values: ['Test', 'Test2', 'Test3'],
            current: 0
          },
          {
            id: 'test5',
            label: 'Test5',
            type: 'separator'
          },
          {
            id: 'test6',
            label: 'Test6',
            type: 'button',
            rightLabel: 'Test'
          }
        ]
      }
    ]);
  }, []);

  return (
    menu && (
      <main
        className="absolute w-[432px] top-5 left-5 tracking-[1px] text-[20px] font-chalet font-black"
        style={{ width: `${menu.width || 432}px` }}
      >
        <header className="w-full h-[128px] bg-header-gradient grid place-items-center">
          <h1 className="font-signpainter text-7xl text-white translate-y-2 font-extralight">
            {menu.title}
          </h1>
        </header>
        {menu.subtitle && <SubTitle>{menu.subtitle}</SubTitle>}
        <section
          className="overflow-y-scroll"
          style={{ maxHeight: `${(menu.maxVisibleItems || 10) * 38}px` }}
        >
          {items.map((item, index) => (
            <Item key={item.id} {...item} selected={index === selected}>
              <Item.Text
                className={item.type === 'separator' ? undefined : 'mr-auto'}
              >
                {item.label}
              </Item.Text>
            </Item>
          ))}
        </section>
        {items[selected]?.description?.trim().length && (
          <Description>{items[selected].description}</Description>
        )}
      </main>
    )
  );
}
