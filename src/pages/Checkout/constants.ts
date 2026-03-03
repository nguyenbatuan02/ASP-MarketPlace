export interface OrderItem {
  name: string;
  sku: string;
  qty: number;
  price: number;
  img: string;
}

export interface Order {
  id: string;
  location: string;
  voucher: string;
  items: OrderItem[];
  totalItems: number;
  totalPrice: number;
}

export interface ShippingInfo {
  name: string;
  phone: string;
  address: string;
}




