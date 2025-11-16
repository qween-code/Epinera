import { create } from 'zustand';
import { getCart, addToCart, removeFromCart, updateCartItem } from '@/app/actions/cart';

// Type definitions based on our database schema and joins
interface CartItem {
  id: string; // This is the cart_item id
  quantity: number;
  product_variants: {
    id: string; // This is the product_variant_id
    name: string;
    price: number;
    currency: string;
    products: {
      title: string;
      description: string | null;
      // image_url: string | null; // Assuming an image_url exists on the products table
    } | null;
  };
}

interface Cart {
  id: string;
  user_id: string;
  created_at: string;
  items: MappedCartItem[]; // Using a mapped/flattened version for easier UI consumption
  currency: string;
}

interface MappedCartItem {
  id: string; // cart_item id
  variant_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string; // Placeholder for now
}


interface CartState {
  cart: Cart | null;
  fetchCart: () => Promise<void>;
  addItem: (variantId: string) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  totalItems: () => number;
  totalPrice: () => number;
}

// Helper function to map the nested Supabase response to a flatter structure for the store
const mapCartData = (cartData: any): Cart | null => {
    if (!cartData || !cartData.cart_items) return null;

    const items: MappedCartItem[] = cartData.cart_items.map((item: CartItem) => {
      const product = item.product_variants?.products;
      return {
        id: item.id,
        variant_id: item.product_variants.id,
        name: `${product?.title || 'Product'} - ${item.product_variants.name}`,
        price: item.product_variants.price,
        quantity: item.quantity,
        image: 'https://placehold.co/80x80', // TODO: Replace with actual product image URL
      };
    });

    return {
      id: cartData.id,
      user_id: cartData.user_id,
      created_at: cartData.created_at,
      items: items,
      currency: items[0]?.product_variants?.currency || 'USD',
    };
  };

const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  fetchCart: async () => {
    const cartData = await getCart();
    const mappedCart = mapCartData(cartData);
    set({ cart: mappedCart });
  },
  addItem: async (variantId) => {
    // We assume the server action handles adding the item correctly.
    // After adding, we refetch the entire cart to ensure client state is in sync.
    await addToCart(variantId, 1);
    await get().fetchCart();
  },
  removeItem: async (itemId) => {
    await removeFromCart(itemId);
    // Optimistically remove from local state before refetching
    set(state => ({
        cart: state.cart ? { ...state.cart, items: state.cart.items.filter(item => item.id !== itemId) } : null
    }));
    await get().fetchCart(); // Refetch to ensure consistency
  },
  updateItemQuantity: async (itemId, quantity) => {
    await updateCartItem(itemId, quantity);
     // Optimistically update local state
     set(state => ({
        cart: state.cart ? { ...state.cart, items: state.cart.items.map(item => item.id === itemId ? {...item, quantity} : item) } : null
    }));
    await get().fetchCart(); // Refetch to ensure consistency
  },
  totalItems: () => get().cart?.items.reduce((total, item) => total + item.quantity, 0) || 0,
  totalPrice: () =>
    get().cart?.items.reduce((total, item) => total + item.price * item.quantity, 0) || 0,
}));

export default useCartStore;
