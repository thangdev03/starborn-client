import axios from "axios"
import { createContext, useContext, useEffect, useState } from "react"
import { serverUrl } from "../services/const";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [quantity, setQuantity] = useState(0);
    const { currentUser } = useAuth();

    const getCartQuantity = async () => {
        if (currentUser) {
            axios.get(serverUrl + `cart/${currentUser.id}`, {
                withCredentials: true
            })
            .then((res) => {
                setQuantity(res.data.length || 0);
            })
            .catch((error) => { 
                setQuantity(0);
                console.log(error);
            })
        }
    };

    useEffect(() => {
        getCartQuantity();
    }, [currentUser])

    return (
        <CartContext.Provider value={{ quantity, getCartQuantity }}>
            {children}
        </CartContext.Provider>
    )
};

export const useCart = () => {
    return useContext(CartContext);
}