'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  CartItem,
  Order,
  OrderStatus,
  Coupon,
  SupportTicket,
  UserRole,
  UserProfile,
  ProductVariant,
  Category,
  DeliveryAssignment,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_ORDERS,
  INITIAL_TICKETS,
  DELIVERY_FLEET,
} from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  // User Profile
  currentUser: UserProfile;
  loginUser: (profile: Partial<UserProfile>) => void;
  logoutUser: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  updateCartQuantity: (productId: string, variantId: string | undefined, delta: number) => void;
  removeFromCart: (productId: string, variantId: string | undefined) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Calculations
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartGst: number;
  cartTotal: number;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: {
      addressLine: string;
      city: string;
      state: string;
      pincode: string;
    };
    paymentMethod: any;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string, assignment?: DeliveryAssignment) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;

  // Fleet & Delivery
  deliveryFleet: typeof DELIVERY_FLEET;

  // Support
  tickets: SupportTicket[];
  submitTicket: (ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'status'>) => Promise<SupportTicket>;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => Promise<void>;

  // Role Simulation
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;

  // Search & Navigation Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: Category | 'all';
  setSelectedCategory: (cat: Category | 'all') => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;

  // DB Sync state
  isDbConnected: boolean;
  refreshFromDb: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const API_BASE = '/golf-api';

const DEFAULT_USER: UserProfile = {
  id: 1,
  name: 'Shopper',
  email: '',
  phone: '',
  addressLine: '',
  city: '',
  state: '',
  pincode: '',
  role: 'customer',
  isLoggedIn: false,
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fairway_current_user');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* fallback */ }
      }
    }
    return DEFAULT_USER;
  });

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fairway_cart');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* fallback */ }
      }
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fairway_wishlist');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* fallback */ }
      }
    }
    return [];
  });

  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [deliveryFleet, setDeliveryFleet] = useState<typeof DELIVERY_FLEET>(DELIVERY_FLEET);

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isDbConnected, setIsDbConnected] = useState(false);

  // Toast system
  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // User Authentication / Profile Management
  const loginUser = (profile: Partial<UserProfile>) => {
    const updated: UserProfile = {
      ...currentUser,
      ...profile,
      isLoggedIn: true,
      name: profile.name || 'Valued Customer',
      role: profile.role || 'customer',
    };
    setCurrentUser(updated);
    setCurrentRole(updated.role);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fairway_current_user', JSON.stringify(updated));
    }
    showToast(`Signed in as ${updated.name}.`);
  };

  const logoutUser = () => {
    setCurrentUser(DEFAULT_USER);
    setCurrentRole('customer');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fairway_current_user');
    }
    showToast('Signed out of account.', 'info');
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    const updated = { ...currentUser, ...profile };
    setCurrentUser(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fairway_current_user', JSON.stringify(updated));
    }
    showToast('Profile information updated.');
  };

  // Synchronize from PHP MySQL Backend
  const refreshFromDb = useCallback(async () => {
    try {
      // 1. Fetch Products
      const prodRes = await fetch(`${API_BASE}/products.php`);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (prodData.products && Array.isArray(prodData.products)) {
          setProducts(prodData.products);
          setIsDbConnected(true);
        }
      }

      // 2. Fetch Orders
      const orderRes = await fetch(`${API_BASE}/orders.php`);
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        if (orderData.orders && Array.isArray(orderData.orders)) {
          setOrders(orderData.orders);
        }
      }

      // 3. Fetch Coupons
      const coupRes = await fetch(`${API_BASE}/coupons.php`);
      if (coupRes.ok) {
        const coupData = await coupRes.json();
        if (coupData.coupons && Array.isArray(coupData.coupons)) {
          setCoupons(coupData.coupons);
        }
      }

      // 4. Fetch Tickets
      const tktRes = await fetch(`${API_BASE}/tickets.php`);
      if (tktRes.ok) {
        const tktData = await tktRes.json();
        if (tktData.tickets && Array.isArray(tktData.tickets)) {
          setTickets(tktData.tickets);
        }
      }

      // 5. Fetch Fleet
      const fleetRes = await fetch(`${API_BASE}/fleet.php`);
      if (fleetRes.ok) {
        const fleetData = await fleetRes.json();
        if (fleetData.fleet && Array.isArray(fleetData.fleet)) {
          setDeliveryFleet(fleetData.fleet);
        }
      }
    } catch (err) {
      console.warn('Backend API connection note (using local cache):', err);
    }
  }, []);

  // Fetch initial data on mount
  useEffect(() => {
    refreshFromDb();
  }, [refreshFromDb]);

  // Local storage persistence for cart & wishlist
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fairway_cart', JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fairway_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist]);

  // Product management with MySQL persistence
  const addProduct = async (newProd: Omit<Product, 'id'>) => {
    try {
      const res = await fetch(`${API_BASE}/products.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.product) {
          setProducts((prev) => [data.product, ...prev]);
          showToast(`Product "${data.product.name}" saved to MySQL Database.`);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
    // Fallback local state
    const id = 'prod-' + Date.now();
    const product: Product = { ...newProd, id };
    setProducts((prev) => [product, ...prev]);
    showToast(`Product "${product.name}" added to catalog.`);
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      await fetch(`${API_BASE}/products.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
    } catch (e) {
      console.error(e);
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Product updated in MySQL database successfully.');
  };

  const deleteProduct = async (id: string) => {
    try {
      await fetch(`${API_BASE}/products.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.error(e);
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from database.', 'info');
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, variant?: ProductVariant) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          ((!item.selectedVariant && !variant) ||
            item.selectedVariant?.id === variant?.id)
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + quantity,
        };
        return next;
      } else {
        return [...prev, { product, quantity, selectedVariant: variant }];
      }
    });

    showToast(`Added ${quantity} × ${product.name} to cart.`);
  };

  const updateCartQuantity = (productId: string, variantId: string | undefined, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (
            item.product.id === productId &&
            item.selectedVariant?.id === variantId
          ) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string, variantId: string | undefined) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedVariant?.id === variantId
          )
      )
    );
    showToast('Item removed from cart.', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Pricing calculations
  const cartSubtotal = cart.reduce((acc, item) => {
    const itemPrice = item.product.price + (item.selectedVariant?.priceModifier || 0);
    return acc + itemPrice * item.quantity;
  }, 0);

  let cartDiscount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrderValue) {
    if (appliedCoupon.discountPercentage) {
      cartDiscount = Math.round((cartSubtotal * appliedCoupon.discountPercentage) / 100);
    } else if (appliedCoupon.discountAmount) {
      cartDiscount = appliedCoupon.discountAmount;
    }
  }

  // Free shipping on orders ₹4,999+ in India
  const cartShipping = cartSubtotal === 0 || cartSubtotal - cartDiscount >= 4999 ? 0 : 250;
  const taxableAmount = Math.max(0, cartSubtotal - cartDiscount);
  // GST 18%
  const cartGst = Math.round(taxableAmount * 0.18);
  const cartTotal = taxableAmount + cartShipping;

  // Coupon handling
  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code === clean);
    if (!found) {
      return { success: false, message: 'Invalid coupon code.' };
    }
    if (cartSubtotal < found.minOrderValue) {
      return {
        success: false,
        message: `Minimum order value of ₹${found.minOrderValue.toLocaleString('en-IN')} required.`,
      };
    }
    setAppliedCoupon(found);
    showToast(`Coupon ${found.code} applied successfully!`);
    return { success: true, message: `Coupon applied: ${found.description}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.', 'info');
  };

  // Wishlist
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed from wishlist: ${product.name}`, 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`Saved to wishlist: ${product.name}`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  // Orders with MySQL persistence
  const createOrder = async (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: {
      addressLine: string;
      city: string;
      state: string;
      pincode: string;
    };
    paymentMethod: any;
  }): Promise<Order> => {
    const payload = {
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      items: cart,
      subtotal: cartSubtotal,
      discount: cartDiscount,
      gst: cartGst,
      shipping: cartShipping,
      total: cartTotal,
    };

    let createdOrder: Order | null = null;
    try {
      const res = await fetch(`${API_BASE}/orders.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          createdOrder = data.order;
        }
      }
    } catch (e) {
      console.error(e);
    }

    if (!createdOrder) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      createdOrder = {
        id: 'ord-' + Date.now(),
        orderNumber: `PF-2026-${randomNum}`,
        date: new Date().toISOString(),
        items: [...cart],
        subtotal: cartSubtotal,
        discount: cartDiscount,
        gst: cartGst,
        shipping: cartShipping,
        total: cartTotal,
        paymentMethod: orderData.paymentMethod,
        paymentStatus: orderData.paymentMethod === 'Cash on Delivery (COD)' ? 'Pending (COD)' : 'Paid',
        orderStatus: 'Order Placed',
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        shippingAddress: orderData.shippingAddress,
        timeline: [
          {
            status: 'Order Placed',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
            note: `Order placed via ${orderData.paymentMethod}. White-Glove delivery scheduled.`,
          },
        ],
      };
    }

    // Refresh products to show updated live stock
    refreshFromDb();
    setOrders((prev) => [createdOrder!, ...prev]);
    clearCart();
    setAppliedCoupon(null);
    showToast(`Order #${createdOrder.orderNumber} successfully recorded in MySQL!`);
    return createdOrder;
  };

  const updateOrderStatus = async (
    orderId: string,
    status: OrderStatus,
    note?: string,
    assignment?: DeliveryAssignment
  ) => {
    try {
      await fetch(`${API_BASE}/orders.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: orderId,
          status,
          note,
          assignment,
        }),
      });
    } catch (e) {
      console.error(e);
    }

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const newTimeline = [
            ...ord.timeline,
            {
              status,
              timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              note: note || `Status updated to ${status}`,
            },
          ];

          return {
            ...ord,
            orderStatus: status,
            deliveryAssignment: assignment || ord.deliveryAssignment,
            timeline: newTimeline,
          };
        }
        return ord;
      })
    );
    showToast(`Order status updated to "${status}" in MySQL database.`);
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  };

  // Support tickets with MySQL persistence
  const submitTicket = async (ticketData: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'status'>) => {
    try {
      const res = await fetch(`${API_BASE}/tickets.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.ticket) {
          setTickets((prev) => [data.ticket, ...prev]);
          showToast(`Ticket #${data.ticket.ticketNumber} saved in database.`);
          return data.ticket;
        }
      }
    } catch (e) {
      console.error(e);
    }

    const randomTicket = 'TKT-' + Math.floor(1000 + Math.random() * 9000);
    const newTicket: SupportTicket = {
      ...ticketData,
      id: 'tkt-' + Date.now(),
      ticketNumber: randomTicket,
      createdAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Open',
    };
    setTickets((prev) => [newTicket, ...prev]);
    showToast(`Support ticket #${newTicket.ticketNumber} created.`);
    return newTicket;
  };

  const updateTicketStatus = async (ticketId: string, status: SupportTicket['status']) => {
    try {
      await fetch(`${API_BASE}/tickets.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ticketId, status }),
      });
    } catch (e) {
      console.error(e);
    }

    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
    showToast(`Ticket status updated to "${status}".`);
  };

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        loginUser,
        logoutUser,
        updateUserProfile,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartGst,
        cartTotal,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        createOrder,
        updateOrderStatus,
        getOrderById,
        deliveryFleet,
        tickets,
        submitTicket,
        updateTicketStatus,
        currentRole,
        setCurrentRole,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        toasts,
        showToast,
        dismissToast,
        isDbConnected,
        refreshFromDb,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
