import { callKw } from '../api/odoo';

export interface OdooProduct {
  id: number;
  name: string;
  description: string | false;
  description_sale: string | false;
  list_price: number;           // giá bán
  standard_price: number;       // giá vốn
  categ_id: [number, string];
  image_1920: string | false;   // base64
  qty_available: number;        // tồn kho
  type: 'consu' | 'service' | 'product';
  // is_published: boolean;
  slug: string | false;
  currency_id: [number, string];
  taxes_id: number[];
  global_code?: string | false;
}

export interface ProductVariant {
  id: number;
  name: string;
  product_tmpl_id: [number, string];
  combination_indices: string;
  lst_price: number;
  image_variant_1920: string | false;
  attribute_value_ids: number[];
}

export interface AspBrand {
  id: number;
  name: string;
  description: string | false;
  image_128: string | false;
  product_count: number;
}

export interface ProductCategory {
  id: number;
  name: string;
  parent_id: [number, string] | false;
  image_128: string | false;
}

const PRODUCT_FIELDS = [
  'id', 'name', 'description_sale', 'list_price', 'categ_id',
  'image_1920', 'qty_available', 'type', 
  'currency_id', 'taxes_id', 'standard_price', 'global_code'
];

export const productService = {

// Tìm kiếm theo global code hoặc tên sản phẩm
  async searchByCode(rawQuery: string): Promise<OdooProduct[]> {
    const trimmed = rawQuery.trim();
    if (!trimmed) return [];

    return callKw<OdooProduct[]>('product.template', 'search_read', [
      ['|',
        ['name', 'ilike', trimmed],
        ['global_code', 'ilike', trimmed], 
      ],
    ], {
      fields: [...PRODUCT_FIELDS, 'global_code'],
      limit: 40,
      order: 'name asc',
    });
  },

    // Lấy danh sách thương hiệu
  async getBrands(): Promise<AspBrand[]> {
    return callKw<AspBrand[]>('asp.brand', 'search_read', [[]], {
      fields: ['id', 'name', 'description', 'image_128', 'product_count'],
      order: 'name asc',
    });
  },

  // Lấy sản phẩm theo brand
  async getProductsByBrand(brandId: number, limit = 20, offset = 0): Promise<OdooProduct[]> {
    return callKw<OdooProduct[]>('product.template', 'search_read', [
      [['brand_id', '=', brandId], ],
    ], { fields: PRODUCT_FIELDS, limit, offset, order: 'name asc' });
  },

  // Lấy danh sách sản phẩm (có filter, search, phân trang)
  async getProducts(opts: {
    search?: string;
    categoryId?: number;
    limit?: number;
    offset?: number;
    onlyPublished?: boolean;
  } = {}): Promise<OdooProduct[]> {
    const { search, categoryId, limit = 20, offset = 0, onlyPublished = true } = opts;

    const domain: unknown[] = [['active', '=', true]];
    if (categoryId) domain.push(['categ_id', '=', categoryId]);
    if (search) domain.push(['name', 'ilike', search]);

    return callKw<OdooProduct[]>('product.template', 'search_read', [domain], {
      fields: PRODUCT_FIELDS,
      limit,
      offset,
      order: 'name asc',
    });
  },

  // Lấy chi tiết 1 sản phẩm theo id
  async getProductById(id: number): Promise<OdooProduct> {
    const results = await callKw<OdooProduct[]>('product.template', 'search_read', [
      [['id', '=', id]],
    ], { fields: [...PRODUCT_FIELDS, 'description'] });

    if (!results.length) throw new Error('Không tìm thấy sản phẩm');
    return results[0];
  },

  // Đếm tổng số sản phẩm (cho phân trang)
  async countProducts(opts: { search?: string; categoryId?: number; brandId?: number } = {}): Promise<number> {
    const { search, categoryId, brandId } = opts;
    const domain: unknown[] = [['active', '=', true]];
    if (categoryId) domain.push(['categ_id', '=', categoryId]);
    if (brandId) domain.push(['brand_id', '=', brandId]);
    if (search) domain.push(['name', 'ilike', search]);

    return callKw<number>('product.template', 'search_count', [domain]);
  },

  // Lấy danh mục sản phẩm
  async getCategories(): Promise<ProductCategory[]> {
  return callKw<ProductCategory[]>('product.category', 'search_read', [[]], {
      fields: ['id', 'name', 'parent_id'],  
      order: 'name asc',
    });
  },

  // Lấy sản phẩm nổi bật (Home page) - lấy 8 sản phẩm mới nhất
  async getFeaturedProducts(limit = 8): Promise<OdooProduct[]> {
    return callKw<OdooProduct[]>('product.template', 'search_read', [
      [['active', '=', true]],
    ], {
      fields: PRODUCT_FIELDS,
      limit,
      order: 'id desc',
    });
  },
};