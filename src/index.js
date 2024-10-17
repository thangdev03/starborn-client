import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <CartProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </CartProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);