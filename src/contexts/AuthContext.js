import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);

    const openAuthModal = () => setAuthModalOpen(true);
    const closeAuthModal = () => setAuthModalOpen(false);

    return <AuthContext.Provider value={{ openAuthModal, closeAuthModal, isAuthModalOpen }}>
        {children}
    </AuthContext.Provider>
}

const useAuth = () => useContext(AuthContext);

export { AuthContextProvider, useAuth }