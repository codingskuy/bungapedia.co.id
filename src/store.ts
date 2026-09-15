import { writable, derived } from 'svelte/store';

export interface CartLine {
  id: string;
  name: string;
  img: string;
  price: number;
  unit: string;
  qty: number;
}

export const cart = writable<CartLine[]>([]);
export const cartCount = derived(cart, ($c) => $c.reduce((n, l) => n + l.qty, 0));
export const cartTotal = derived(cart, ($c) => $c.reduce((n, l) => n + l.qty * l.price, 0));

export function addToCart(line: Omit<CartLine, 'qty'>, qty = 1) {
  cart.update((cs) => {
    const ex = cs.find((l) => l.id === line.id);
    if (ex) return cs.map((l) => (l.id === line.id ? { ...l, qty: l.qty + qty } : l));
    return [...cs, { ...line, qty }];
  });
}

export function bumpQty(id: string, d: number) {
  cart.update((cs) => cs.map((l) => (l.id === id ? { ...l, qty: l.qty + d } : l)).filter((l) => l.qty > 0));
}

export function clearCart() {
  cart.set([]);
}

// ---- toast global ----
export const toast = writable('');
let toastTimer: ReturnType<typeof setTimeout>;
export function showToast(msg: string) {
  toast.set(msg);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.set(''), 2600);
}

// ---- timer reservasi keranjang 90 menit (meniru "Cart Timer: 90 mins") ----
export const cartDeadline = writable<number | null>(null);
export function ensureCartTimer() {
  cartDeadline.update((d) => d ?? Date.now() + 90 * 60 * 1000);
}
