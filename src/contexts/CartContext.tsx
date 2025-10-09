import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

export interface CartItem {
  id: string;
  title: string;
  type: 'ebook' | 'course';
  price: number;
  coverImage?: string;
  thumbnail?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalAmount: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === item.id && i.type === item.type);
      if (exists) {
        toast({
          title: "Already in cart",
          description: "This item is already in your cart",
        });
        return prev;
      }
      toast({
        title: "Added to cart",
        description: `${item.title} has been added to your cart`,
      });
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart",
    });
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
  const itemCount = items.length;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalAmount,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
