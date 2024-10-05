import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import axios from "axios"
import { serverUrl } from "../services/const";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [authToken, setAuthToken] = useState();
    const [currentUser, setCurrentUser] = useState();
    const [checking, setChecking] = useState(true);

    const openAuthModal = () => setAuthModalOpen(true);
    const closeAuthModal = () => setAuthModalOpen(false);

    async function handleLogin(emailOrPhone, password) {
        setChecking(true);
        axios.post(serverUrl + 'auth/login/customer', {
            emailOrPhone: emailOrPhone,
            password: password
        }, {
            withCredentials: true
        })
        .then((res) => {
            if (res.data) {
                setAuthToken(res.data.accessToken);
                setCurrentUser(res.data.user);
                closeAuthModal();
                alert(res.data.message);
                sessionStorage.setItem('accessToken', JSON.stringify(res.data.accessToken));
                sessionStorage.setItem('currentUser', JSON.stringify(res.data.user));
            }
        })
        .catch((err) => {
            setAuthToken(null);
            setCurrentUser(null);
            alert(err.response.data?.message);
        })
        .finally(() => setChecking(false))
    }

    async function handleLogout() {
        setChecking(true);
        axios.post(serverUrl + 'auth/logout/customer', {}, {
            withCredentials: true
        })
        .then(() => {
            setAuthToken(null);
            setCurrentUser(null);
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('currentUser');
        })
        .catch((error) => console.log(error))
        .finally(() => setChecking(false))
    }

    useLayoutEffect(() => {
        const authInterceptor = axios.interceptors.request.use(
            (config) => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${authToken}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        )

        return () => {
            axios.interceptors.request.eject(authInterceptor);
        }
    }, [authToken])

    useLayoutEffect(() => {
        setChecking(true);
        const refreshInterceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error?.config;

                if (error?.response.status === 403 && !originalRequest?._retry) {
                    originalRequest._retry = true;
                    try {
                        axios.get(serverUrl + 'auth/refreshToken', {
                            headers: { 'Content-Type': 'application/json' },
                            withCredentials: true,
                        })
                        .then((res) => {
                            setAuthToken(res.data.accessToken);
                            setCurrentUser(res.data.user);
                            sessionStorage.setItem('accessToken', JSON.stringify(res.data.accessToken));
                            sessionStorage.setItem('currentUser', JSON.stringify(res.data.user));

                            originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;

                            return axios(originalRequest);
                        })
                        .catch((error) => {throw new Error(error)})
                    } catch (error) {
                        setAuthToken(null);
                        setCurrentUser(null);
                    }
                }
                return Promise.reject(error);
            },
        );
        setChecking(false);

        return () => {
            axios.interceptors.response.eject(refreshInterceptor);
        }
    }, [authToken])

    useLayoutEffect(() => {
        setChecking(true);
        const refresh = async () => {
            axios.get(serverUrl + 'auth/refreshToken', {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            })
            .then((res) => {
                setAuthToken(res.data.accessToken);
                setCurrentUser(res.data.user);
                sessionStorage.setItem('accessToken', JSON.stringify(res.data.accessToken));
                sessionStorage.setItem('currentUser', JSON.stringify(res.data.user));
            })
            .catch((err) => {
                setAuthToken(null);
                setCurrentUser(null);
                console.log("Error refreshing token: ", err)
            })
            .finally(() => setChecking(false))
        }
        refresh();
    }, [])

    return (
        <AuthContext.Provider 
        value={{ 
            openAuthModal, 
            closeAuthModal, 
            isAuthModalOpen,
            handleLogin,
            handleLogout,
            authToken,
            currentUser,
            checking
        }}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => useContext(AuthContext);

export { AuthContextProvider, useAuth }