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
import Checkout from './pages/client/Checkout';
import Account from './pages/client/Account';
import Favorites from './pages/client/Favorites';
import EmployeePrivateRoutes from './utils/EmployeePrivateRoutes';
import EmployeeLogin from './pages/admin/EmployeeLogin';
import OrderDetail from './pages/admin/OrderDetail';
import BodyMeasureRoom from './components/client/BodyMeasureRoom';
import Employees from './pages/admin/Employees';
import Collection from './pages/admin/Collection';
import CollectionDetail from './pages/admin/CollectionDetail';
import CollectionShow from './pages/client/CollectionShow';
import SearchResult from './pages/client/SearchResult';

const AppRoutes = () => {

  return (
    <Routes>
      <Route path='/'>
        <Route path='' element={<Home />}/>
        <Route path=':objectSlug' element={<AllProducts />}/>
      </Route>
      <Route path='/collection'>
        <Route path=':collectionSlug' element={<CollectionShow />}/>
      </Route>
      <Route path='/product/:productName' element={<ProductDetail />}/>
      <Route element={<CustomerPrivateRoutes />}>
        <Route path='/cart' element={<Cart />}/>
        <Route path='/checkout' element={<Checkout />}/>
        <Route path='/account' element={<Account />} >
          <Route path='' element={<Navigate to='/account/info' replace/>}/>
          <Route path='info' />
          <Route path='address' />
          <Route path='orders'>
            <Route path='' />
            <Route path=':orderId' />
          </Route>
          <Route path='orders-cancel' />
          <Route path='rating' />
        </Route>
        <Route path='/favorites' element={<Favorites />}/>
      </Route>
      <Route path='measure-body' element={<BodyMeasureRoom />}/>
      <Route path='/search' element={<SearchResult />}/>

        {/* Admin Routes */}
      <Route path='/admin'>
        <Route element={<EmployeePrivateRoutes />}>
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
          <Route path='orders'>
            <Route path='' element={<Orders />}/>
            <Route path=':orderId' element={<OrderDetail />}/>
          </Route>
          <Route path='customers'>
            <Route path='' element={<Customers />} />
            <Route path=':customerId' element={<CustomerDetail />} />
          </Route>
          <Route path='coupons' element={<Vouchers />}/>
          <Route path='employees' element={<Employees />}/>
          <Route path='collection'>
            <Route path='' element={<Collection />} />
            <Route path=':collectionId' element={<CollectionDetail />} />
          </Route>
        </Route>
        <Route path='login' element={<EmployeeLogin />}/>
      </Route>

      <Route path='*' element={<Navigate to="/"/>}/>
    </Routes>
  )
}

export default AppRoutes