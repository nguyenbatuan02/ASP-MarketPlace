import type { Address } from '../components/AddressManager/AddressManager';

export const MOCK_ACCOUNT = {
  name: 'Nguyễn Trung Hiếu',
  phone: '0909141283',
  dob: '22/03/1998',
  gender: 'male',
  email: 'hieu.nguyen@gmail.com',
};

export const MOCK_ADDRESSES: Address[] = [
  {
    id: '1',
    name: 'Anton Vuong',
    phone: '0123456789',
    detail: '10 Ngõ Huế',
    ward: 'Phường Phố Huế',
    district: 'Quận Hai Bà Trưng',
    city: 'Thành phố Hà Nội',
    isDefault: true,
  },
  {
    id: '2',
    name: 'Anton Vuong',
    phone: '0123456789',
    detail: '10 Ngõ Huế',
    ward: 'Phường Phố Huế',
    district: 'Quận Hai Bà Trưng',
    city: 'Thành phố Hà Nội',
    isDefault: false,
  },
];

export const MOCK_BUSINESS = {
  bizName: 'HT Auto Company Limited',
  group: 'garage',
  taxCode: '0123456789',
  bizRegAddress: '68 Ngõ Huế, phường Phố Huế, quận Hai Bà Trưng, thành phố Hà Nội, Việt Nam',
  legalRep: 'Hoàng Thị Hường',
  bizPhone: '0123456789',
};