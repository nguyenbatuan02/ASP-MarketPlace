import { callKw } from '../api/odoo';

export interface OdooOrderLine {
  id: number;
  product_id: [number, string];
  name: string;
  product_uom_qty: number;
  price_unit: number;
  price_subtotal: number;
  price_total: number;
}

export interface OdooOrder {
  id: number;
  name: string;                       
  state: 'draft' | 'sent' | 'sale' | 'done' | 'cancel';
  date_order: string;
  partner_id: [number, string];
  amount_untaxed: number;
  amount_tax: number;
  amount_total: number;
  order_line: number[];
  note: string | false;
  delivery_status: string | false;
}

export interface OdooOrderDetail extends OdooOrder {
  lines: OdooOrderLine[];
}

const STATE_LABEL: Record<string, string> = {
  draft: 'Nháp',
  sent: 'Đã gửi báo giá',
  sale: 'Đang xử lý',
  done: 'Hoàn thành',
  cancel: 'Đã hủy',
};

const ORDER_FIELDS = [
  'id', 'name', 'state', 'date_order', 'partner_id',
  'amount_untaxed', 'amount_tax', 'amount_total', 'order_line', 'note',
];

export const orderService = {
  // Lấy danh sách đơn hàng của user hiện tại
  async getMyOrders(partnerId: number): Promise<OdooOrder[]> {
    const orders = await callKw<OdooOrder[]>('sale.order', 'search_read', [
      [['partner_id', '=', partnerId]],
    ], {
      fields: ORDER_FIELDS,
      order: 'date_order desc',
    });

    return orders.map(o => ({ ...o, stateLabel: STATE_LABEL[o.state] }));
  },

  // Lấy chi tiết đơn hàng + order lines
  async getOrderById(orderId: number): Promise<OdooOrderDetail> {
    const orders = await callKw<OdooOrder[]>('sale.order', 'search_read', [
      [['id', '=', orderId]],
    ], { fields: ORDER_FIELDS });

    if (!orders.length) throw new Error('Không tìm thấy đơn hàng');
    const order = orders[0];

    const lines = await callKw<OdooOrderLine[]>('sale.order.line', 'search_read', [
      [['order_id', '=', orderId]],
    ], {
      fields: ['id', 'product_id', 'name', 'product_uom_qty', 'price_unit', 'price_subtotal', 'price_total'],
    });

    return { ...order, lines };
  },

  // Tạo đơn hàng từ giỏ hàng (checkout)
  async createOrder(data: {
    partnerId: number;
    lines: { productId: number; qty: number; price: number }[];
    note?: string;
  }): Promise<number> {
    const orderLines = data.lines.map(l => [
      0, 0,
      {
        product_id: l.productId,
        product_uom_qty: l.qty,
        price_unit: l.price,
      },
    ]);

    const orderId = await callKw<number>('sale.order', 'create', [{
      partner_id: data.partnerId,
      order_line: orderLines,
      note: data.note || '',
    }]);

    return orderId;
  },

  async confirmOrder(orderId: number): Promise<void> {
    await callKw('sale.order', 'action_confirm', [[orderId]]);
  },

  getStateLabel(state: string): string {
    return STATE_LABEL[state] || state;
  },
};