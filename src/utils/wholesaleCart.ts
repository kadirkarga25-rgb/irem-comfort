import { CollectionItem } from '../types';
export interface WholesaleCartItem { productId:string; name:string; category?:string; color?:string; quantity:number; image?:string; }
const KEY='irem_wholesale_quote_cart';
export const getWholesaleCart=():WholesaleCartItem[]=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}};
export const saveWholesaleCart=(items:WholesaleCartItem[])=>localStorage.setItem(KEY,JSON.stringify(items));
export const addToWholesaleCart=(item:CollectionItem,color?:string,quantity=1)=>{const items=getWholesaleCart();const i=items.findIndex(x=>x.productId===item.id&&(x.color||'')===(color||''));if(i>=0)items[i]={...items[i],quantity:items[i].quantity+quantity};else items.push({productId:item.id,name:item.name,category:item.category,color,quantity,image:item.image});saveWholesaleCart(items);window.dispatchEvent(new Event('wholesale-cart-updated'));return items};
export const removeFromWholesaleCart=(productId:string,color?:string)=>{saveWholesaleCart(getWholesaleCart().filter(x=>!(x.productId===productId&&(x.color||'')===(color||''))));window.dispatchEvent(new Event('wholesale-cart-updated'))};
export const clearWholesaleCart=()=>{saveWholesaleCart([]);window.dispatchEvent(new Event('wholesale-cart-updated'))};