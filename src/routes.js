import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/admin/Dashboard';
import Categories from './pages/admin/Categories';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Customers from './pages/admin/Customers';
import ProductDetail from './pages/admin/ProductDetail';
import Subcategories from './pages/admin/Subcategories';
import Objects from './pages/admin/Objects';
import Vouchers from './pages/admin/Vouchers';

const AppRoutes = () => {
  return (
    <Routes>

    {/* Admin Routes */}
        <Route path='/admin'>
          <Route path='' element={<Navigate to='dashboard' replace/>}/>
          <Route path='dashboard' element={<Dashboard/>}/>
          <Route path='objects' element={<Objects/>}/>
          <Route path='categories' element={<Categories/>}/>
          <Route path='subcategories' element={<Subcategories/>}/>
          <Route path='products' element={<Products/>}>
            <Route path=':productId' element={<ProductDetail/>}/>
          </Route>
          <Route path='orders' element={<Orders/>}/>
          <Route path='customers' element={<Customers/>}/>
          <Route path='coupons' element={<Vouchers/>}/>
        </Route>

        <Route path='*' element={<Navigate to="/"/>}/>
    </Routes>
  )
}

export default AppRoutes