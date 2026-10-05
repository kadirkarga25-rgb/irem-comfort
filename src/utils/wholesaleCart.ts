import type { CollectionItem } from '../types';

export interface WholesaleCartItem {
  productId: string;
  name: string;
  category?: string;
  color?: string;
  quantity: number;
  image?: string;
}

const KEY = 'irem_wholesale_quote_cart';

const canUseStorage = () => typeof window !== 'undefined' && !!window.localStorage;

export const getWholesaleCart = (): WholesaleCartItem[] => {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveWholesaleCart = (items: WholesaleCartItem[]) => {
  if (!canUseStorage()) return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
};

const notifyCartChanged = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('wholesale-cart-updated'));
  }
};

export const addToWholesaleCart = (item: CollectionItem, color?: string, quantity = 1) => {
  const items = getWholesaleCart();
  const safeQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
  const index = items.findIndex(
    x => x.productId === item.id && (x.color || '') === (color || '')
  );

  if (index >= 0) {
    items[index] = { ...items[index], quantity: items[index].quantity + safeQuantity };
  } else {
    items.push({
      productId: item.id,
      name: item.name,
      category: item.category,
      color,
      quantity: safeQuantity,
      image: item.image,
    });
  }

  saveWholesaleCart(items);
  notifyCartChanged();
  return items;
};

export const removeFromWholesaleCart = (productId: string, color?: string) => {
  saveWholesaleCart(
    getWholesaleCart().filter(
      x => !(x.productId === productId && (x.color || '') === (color || ''))
    )
  );
  notifyCartChanged();
};

export const clearWholesaleCart = () => {
  saveWholesaleCart([]);
  notifyCartChanged();
};
