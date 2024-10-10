import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/admin/Dashboard';
import Categories from './pages/admin/Categories';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Customers from './pages/admin/Customers';
import AdminProductDetail from './pages/admin/AdminProductDetail';
import Subcategories from './pages/admin/Subcategories';
import Objects from './pages/admin/Objects';
import AddProduct from './pages/admin/AddProduct';
import Vouchers from './pages/admin/Vouchers';
import CustomerDetail from './pages/admin/CustomerDetail';
import Home from './pages/client/Home';
import ProductDetail from './pages/client/ProductDetail';
import AllProducts from './pages/client/AllProducts';
import Cart from './pages/client/Cart';
import CustomerPrivateRoutes from './utils/CustomerPrivateRoutes';
import { useAuth } from './contexts/AuthContext';
import Checkout from './pages/client/Checkout';
import Account from './pages/client/Account';

const AppRoutes = () => {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path='/'>
        <Route path='' element={<Home />}/>
        <Route path=':objectSlug' element={<AllProducts />}/>
      </Route>
      <Route path='/collection' element={''}>
        <Route path=':collectionSlug' element={''}/>
      </Route>
      <Route path='/product/:productName' element={<ProductDetail />}/>
      <Route element={<CustomerPrivateRoutes />}>
        <Route path='/cart' element={<Cart />}/>
        <Route path='/checkout' element={<Checkout />}/>
        <Route path='/account'>
          <Route path='' element={<Navigate to='/account/info' replace/>}/>
          <Route path='info' element={<Account />} />
          <Route path='address' element={<Account />} />
          <Route path='orders' element={<Account />} >
            <Route path=''/>
            <Route path=':orderId'/>
          </Route>
          <Route path='reviews'/>
        </Route>
      </Route>

        {/* Admin Routes */}
      <Route path='/admin'>
        <Route path='' element={<Navigate to='dashboard' replace/>}/>
        <Route path='dashboard' element={<Dashboard/>}/>
        <Route path='objects' element={<Objects/>}/>
        <Route path='categories' element={<Categories/>}/>
        <Route path='subcategories' element={<Subcategories/>}/>
        <Route path='products'>
          <Route path='' element={<Products />}/>
          <Route path=':productId' element={<AdminProductDetail/>}/>
          <Route path='create' element={<AddProduct/>}/>
        </Route>
        <Route path='orders' element={<Orders/>}/>
        <Route path='customers'>
          <Route path='' element={<Customers />} />
          <Route path=':id' element={<CustomerDetail />} />
        </Route>
        <Route path='coupons' element={<Vouchers/>}/>
      </Route>

      <Route path='*' element={<Navigate to="/"/>}/>
    </Routes>
  )
}

export default AppRoutes