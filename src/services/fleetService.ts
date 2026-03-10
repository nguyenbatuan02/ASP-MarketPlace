import { callKw } from '../api/odoo';

export interface FleetBrand {
  id: number;
  name: string;
}

export interface FleetModel {
  id: number;
  name: string;
  brand_id: [number, string];
}

export interface FleetVehicle {
  id: number;
  name: string;
  vin_sn: string | false;
  model_id: [number, string];
  model_year: number | false;
  license_plate: string | false;
  power: number | false;
  fuel_type: string | false;
}

export const fleetService = {
  // Lấy tất cả hãng xe
  async getBrands(): Promise<FleetBrand[]> {
    return callKw<FleetBrand[]>('fleet.vehicle.model.brand', 'search_read', [[]], {
      fields: ['id', 'name'],
      order: 'name asc',
    });
  },

  // Lấy model theo hãng (hoặc tất cả nếu không truyền brandId)
  async getModels(brandId?: number): Promise<FleetModel[]> {
    const domain = brandId ? [['brand_id', '=', brandId]] : [];
    return callKw<FleetModel[]>('fleet.vehicle.model', 'search_read', [domain], {
      fields: ['id', 'name', 'brand_id'],
      order: 'name asc',
    });
  },

  // Lấy các năm có xe (distinct model_year)
  async getYears(): Promise<number[]> {
    const vehicles = await callKw<{ model_year: number | false }[]>(
      'fleet.vehicle', 'search_read', [[['model_year', '!=', false]]], {
        fields: ['model_year'],
      }
    );
    const years = [...new Set(
      vehicles
        .map(v => v.model_year)
        .filter((y): y is number => !!y)
    )].sort((a, b) => b - a); 
    return years;
  },

  // Tìm xe theo VIN
  async searchByVin(vin: string): Promise<FleetVehicle[]> {
    const trimmed = vin.trim().toUpperCase();
    if (!trimmed) return [];
    return callKw<FleetVehicle[]>('fleet.vehicle', 'search_read', [
      [['vin_sn', 'ilike', trimmed]],
    ], {
      fields: ['id', 'name', 'vin_sn', 'model_id', 'model_year', 'license_plate', 'power', 'fuel_type'],
      limit: 10,
    });
  },

  // Tìm xe theo bộ lọc
  async searchByFilter(opts: {
    brandId?: number;
    modelId?: number;
    year?: number;
  }): Promise<FleetVehicle[]> {
    const domain: unknown[] = [];

    if (opts.modelId) {
      domain.push(['model_id', '=', opts.modelId]);
    } else if (opts.brandId) {
      const models = await fleetService.getModels(opts.brandId);
      const modelIds = models.map(m => m.id);
      if (modelIds.length === 0) return [];
      domain.push(['model_id', 'in', modelIds]);
    }

    if (opts.year) {
      domain.push(['model_year', '=', opts.year]);
    }

    // Nếu không có filter nào thì không trả về toàn bộ fleet
    if (domain.length === 0) return [];

    return callKw<FleetVehicle[]>('fleet.vehicle', 'search_read', [domain], {
      fields: ['id', 'name', 'vin_sn', 'model_id', 'model_year', 'license_plate', 'power', 'fuel_type'],
      limit: 50,
      order: 'model_year desc',
    });
  },
};