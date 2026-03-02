import { useRoutes } from 'react-router-dom';
import CheckoutPage from './pages/Checkout/CheckoutPage';
import CartPage from './pages/Cart/CartPage';
import CatalogPage from './pages/Catalog/CatalogPage';
import ProductDetailPage from './pages/ProductDetail/ProductDetailPage';
import HomePage from './pages/Home/HomePage';
import OrderListPage from './pages/OrderList/OrderListPage';
import OrderDetailPage from './pages/OrderDetail/OrderDetailPage';
import AccountPage from './pages/Account/AccountPage';

export default function App() {
  const routes = useRoutes([
    { path: '/', element: <HomePage /> },
    { path: '/checkout', element: <CheckoutPage /> },
    { path: '/cart', element: <CartPage /> },
    { path: '/cart/deal', element: <CartPage showDealAndGift /> },
    { path: '/catalog', element: <CatalogPage /> },
    { path: '/product/:id', element: <ProductDetailPage /> },
    { path: '/orders', element: <OrderListPage /> },
    { path: '/orders/:id', element: <OrderDetailPage /> },
    { path: '/account', element: <AccountPage /> },
  ]);
  return routes;
}