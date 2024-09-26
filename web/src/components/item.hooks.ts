import { useContext } from 'react';
import { ItemContext } from '@/components/item';

export function useItem() {
  if (!ItemContext) {
    throw new Error('useItem must be used within a Item');
  }

  return useContext(ItemContext);
}
