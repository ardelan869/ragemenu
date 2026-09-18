import { cn, debugData, fetchNui, vmin } from '@/lib';

import Item, { type ItemProps } from '@/components/item';
import SubTitle from '@/components/sub-title';
import Description from '@/components/description';
import ColoredText from '@/components/colored-text';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import { useKeyDown } from '@/lib/keys';
import { useNuiEvent } from '@/lib/hooks';

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

const isSelectable = (item?: ItemProps): item is ItemProps =>
  !!item &&
  item.type !== 'separator' &&
  !item.disabled &&
  item.visible !== false;

/**
 * Index of the first selectable item, starting at `from` and walking in
 * `step` direction (wrapping around), or -1 if there is none.
 */
const findSelectable = (items: ItemProps[], from: number, step: 1 | -1) => {
  for (let i = 0; i < items.length; i++) {
    const index =
      (((from + i * step) % items.length) + items.length) % items.length;

    if (isSelectable(items[index])) return index;
  }

  return -1;
};

export default function Menu() {
  // id of the menu the current selection was initialised for
  const lastMenu = useRef<string | undefined>(undefined);
  const lastSelected = useRef<Record<string, number>>({});
  const [menu, setMenu] = useState<MenuProps | undefined>();
  const [items, setItems] = useState<ItemProps[]>([]);
  const [selected, setSelected] = useState(-1);

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
    setMenu(_menu);
    // `SetItems` always follows, drop the previous menu's items so the
    // selection is never initialised against them
    setItems([]);
  });

  useNuiEvent<ItemProps[] | undefined>('SetItems', (_items) => {
    setItems(_items ?? []);
  });

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

  const arrowUp = useCallback(() => {
    setSelected(findSelectable(items, selected - 1, -1));
  }, [items, selected]);
  useKeyDown('ArrowUp', arrowUp);

  const arrowDown = useCallback(() => {
    setSelected(findSelectable(items, selected + 1, 1));
  }, [items, selected]);
  useKeyDown('ArrowDown', arrowDown);

  const arrowRight = useCallback(() => {
    const item = items[selected];

    if (!isSelectable(item)) return;

    if (item.type === 'list') {
      if (item.current === item.values.length - 1) item.current = 0;
      else item.current++;
    } else if (item.type === 'slider') {
      if (item.current === item.max) return;

      item.current += Math.min(item.step ?? 1, item.max);
    }

    fetchNui('OnChange', {
      menu,
      selected: item.id,
      current: item.current
    });

    setItems([...items]);
  }, [menu, items, selected]);
  useKeyDown('ArrowRight', arrowRight);

  const arrowLeft = useCallback(() => {
    const item = items[selected];

    if (!isSelectable(item)) return;

    if (item.type === 'list') {
      if (item.current === 0) item.current = item.values.length - 1;
      else item.current--;
    } else if (item.type === 'slider') {
      if (item.current === (item.min ?? 0)) return;

      item.current -= Math.max(item.step ?? 1, item.min ?? 0);
    }

    fetchNui('OnChange', {
      menu,
      selected: item.id,
      current: item.current
    });

    setItems([...items]);
  }, [menu, items, selected]);
  useKeyDown('ArrowLeft', arrowLeft);

  const enter = useCallback(() => {
    const item = items[selected];

    if (!isSelectable(item)) return;

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

  // Initialise the selection once a menu's items arrive (restoring the last
  // position when returning to it) and keep it on a selectable item whenever
  // the items change. Layout effect, so an invalid selection is never painted.
  useLayoutEffect(() => {
    if (!menu) {
      lastMenu.current = undefined;
      return;
    }

    if (!items.length) return;

    if (menu.id !== lastMenu.current) {
      lastMenu.current = menu.id;

      setSelected(findSelectable(items, lastSelected.current[menu.id] ?? 0, 1));
    } else if (!isSelectable(items[selected])) {
      setSelected(findSelectable(items, Math.max(selected, 0), 1));
    }
  }, [menu, items, selected]);

  useEffect(() => {
    if (!menu || menu.id !== lastMenu.current) return;

    lastSelected.current[menu.id] = selected;
  }, [selected, menu]);

  useEffect(() => {
    if (!menu || !isSelectable(items[selected])) {
      document
        .querySelector('[data-selected="true"]')
        ?.removeAttribute('data-selected');

      return;
    }

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
    debugData([
      {
        action: 'SetMenu',
        data: {
          id: 'test',
          resource: 'ragemenu',
          title: '~g~Test~s~',
          subtitle: '~g~Test~s~',
          width: 431,
          maxVisibleItems: 5,
          banner: 'https://i.imgur.com/Ua8m2Wq.gif'
        }
      },
      {
        action: 'SetItems',
        data: [
          {
            id: 'test',
            label: '~g~Test~s~',
            description:
              '~g~Test~s~\nLongTextLongTextLongTextLongTextLongTextLongTextLongText',
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
            label: '~r~Test~s~ Test ~g~Test~s~',
            type: 'separator'
          },
          {
            id: 'test7',
            label: 'Imaginary Submenu IIII',
            type: 'button',
            badges: {
              right: 'arrowright'
            }
          },
          {
            id: 'test8',
            label: 'Test7',
            type: 'button',
            rightLabel: 'Test Test Test Test'
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
            <ColoredText>{menu.title}</ColoredText>
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
                className={
                  item.type === 'separator' ? 'pr-0 text-center' : 'mr-auto'
                }
              >
                <ColoredText>{item.label}</ColoredText>
              </Item.Text>
            </Item>
          ))}
        </section>
        {menu &&
          menu.maxVisibleItems &&
          items.length > menu.maxVisibleItems && (
            <div className="relative grid h-[3.3333vmin] w-full place-items-center bg-[#0A0A0A]/85">
              <img
                src="assets/images/arrowleft.png"
                className="absolute top-[0.0926vmin] h-[1.6667vmin] w-[1.6667vmin] rotate-90 object-contain"
              />
              <img
                src="assets/images/arrowright.png"
                className="absolute bottom-[0.0926vmin] h-[1.6667vmin] w-[1.6667vmin] rotate-90 object-contain"
              />
            </div>
          )}
        {items[selected]?.description?.trim?.().length && (
          <Description>
            <ColoredText>{items[selected].description}</ColoredText>
          </Description>
        )}
      </main>
    )
  );
}
