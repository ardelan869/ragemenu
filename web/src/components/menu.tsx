import Item, { type ItemProps } from '@/components/item';
import SubTitle from '@/components/sub-title';
import Description from '@/components/description';

import { useState } from 'react';
import { useKeyDown } from '@/lib/keys';
import { useNuiEvent } from '@/lib/hooks';
import { fetchNui } from '@/lib';

interface MenuProps {
  id: string;
  resource: string;
  title: string;
  subtitle?: string;
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

    if (items[index]?.type === 'separator') index--;

    if (index < 0) index = items.length - 1;

    fetchNui('OnSelect', {
      menu,
      selected: items[selected].id
    });

    setSelected(index);
  }
  useKeyDown('ArrowUp', ArrowUp);
  useNuiEvent('ArrowUp', ArrowUp);

  function ArrowDown() {
    let index = Math.min(items.length, selected + 1);

    if (items[index]?.type === 'separator') index += 1;

    if (index === items.length)
      index = items.findIndex((c) => c.type !== 'separator') ?? 0;

    fetchNui('OnSelect', {
      menu,
      selected: items[selected].id
    });

    setSelected(index);
  }
  useKeyDown('ArrowDown', ArrowDown);
  useNuiEvent('ArrowDown', ArrowDown);

  function ArrowRight() {
    const item = items[selected];

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
  useNuiEvent('ArrowRight', ArrowRight);

  function ArrowLeft() {
    const item = items[selected];

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
  useNuiEvent('ArrowLeft', ArrowLeft);

  function Enter() {
    if (items[selected].type === 'checkbox') {
      items[selected].checked = !items[selected].checked;

      fetchNui('OnCheck', {
        menu,
        selected: items[selected].id,
        checked: items[selected].checked
      });

      return setItems([...items]);
    }

    fetchNui('OnClick', {
      menu,
      selected: items[selected].id
    });
  }
  useKeyDown('Enter', Enter);
  useNuiEvent('Enter', Enter);

  function Escape() {
    setItems([]);
    setSelected(0);

    fetchNui('Exit', { menu });
  }
  useKeyDown('Escape', Escape);
  useKeyDown('Backspace', Escape);
  useNuiEvent('Escape', Escape);

  return (
    menu && (
      <main className="absolute w-[432px] top-5 left-5 tracking-[1px] text-[20px] font-chalet font-black">
        <header className="w-full h-[128px] bg-header-gradient grid place-items-center">
          <h1 className="font-signpainter text-7xl text-white translate-y-2 font-extralight">
            {menu.title}
          </h1>
        </header>
        <SubTitle>{menu.subtitle}</SubTitle>
        <section>
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
