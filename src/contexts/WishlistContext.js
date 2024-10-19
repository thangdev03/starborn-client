import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { serverUrl } from "../services/const";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const { currentUser, openAuthModal, accountType } = useAuth();
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  const getAllFavorites = async () => {
    if (currentUser && accountType === 'customer') {
      if (currentUser) {
        setLoadingFavorites(true);
        axios
          .get(serverUrl + `favorites/${currentUser?.id}`)
          .then((res) => setFavoriteItems(res.data))
          .catch((error) => console.log(error))
          .finally(() => setLoadingFavorites(false));
      }
    } else {
      setFavoriteItems([]);
    }
  };

  const addToFavorites = async (variantId) => {
    if (!currentUser && accountType !== 'customer') {
      openAuthModal();
      return;
    }
    axios
      .post(
        serverUrl + "favorites",
        {
          customer_id: currentUser?.id,
          product_variant_id: variantId,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        getAllFavorites();
      })
      .catch((error) => console.log(error))
  };

  const removeFromFavorites = async (variantId) => {
    if (accountType === 'customer') {
      axios
        .delete(serverUrl + `favorites/${variantId}/${currentUser?.id}`, {
          withCredentials: true,
        })
        .then((res) => {
          setFavoriteItems((prev) => prev.filter(i => i.variant_id !== variantId));
        })
        .catch((error) => console.log(error))
    }
  };

  useEffect(() => {
    getAllFavorites();
  }, [currentUser]);

  return (
    <WishlistContext.Provider 
      value={{ 
        favoriteItems,
        loadingFavorites,
        addToFavorites,
        removeFromFavorites 
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  return useContext(WishlistContext);
};
