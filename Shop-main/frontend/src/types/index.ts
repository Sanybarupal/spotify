export type Category = 'balls' | 'apparel' | 'footwear' | 'bags' | 'accessories';

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  priceModifier?: number;
  stock: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  brand: string;
  price: number;
  mrp: number;
  sku: string;
  stock: number;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  bestseller?: boolean;
  image: string;
  gallery: string[];
  description: string;
  specs: Record<string, string>;
  variants?: ProductVariant[];
  variantType?: 'size' | 'color' | 'pack';
  reviews?: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export type OrderStatus = 
  | 'Order Placed'
  | 'Processing'
  | 'Packed'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'UPI' | 'Credit/Debit Card' | 'Net Banking' | 'Cash on Delivery (COD)';

export interface DeliveryAssignment {
  driverName: string;
  driverPhone: string;
  vehicleNo: string;
  estimatedTime?: string;
  deliveryNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  gst: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending (COD)' | 'Refunded';
  orderStatus: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
  };
  deliveryAssignment?: DeliveryAssignment;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
}

export interface Coupon {
  code: string;
  discountPercentage?: number;
  discountAmount?: number;
  minOrderValue: number;
  description: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  email: string;
  subject: string;
  category: 'Order Query' | 'Delivery Issue' | 'Product Fitting' | 'Return/Refund' | 'Other';
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  orderId?: string;
}

export type UserRole = 'customer' | 'admin' | 'order_manager' | 'delivery_staff' | 'seller';

export interface UserProfile {
  id?: number;
  name: string;
  email: string;
  phone: string;
  addressLine?: string;
  city?: string;
  state?: string;
  pincode?: string;
  role: UserRole;
  isLoggedIn: boolean;
}
