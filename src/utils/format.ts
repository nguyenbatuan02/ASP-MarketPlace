export const formatPrice = (n: number): string => {
  return n.toLocaleString('vi-VN') + 'đ';
};