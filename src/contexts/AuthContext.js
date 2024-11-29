import { createContext, useContext, useLayoutEffect, useState } from "react";
import axios from "axios"
import { serverUrl } from "../services/const";
import { toast } from "react-toastify";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [authToken, setAuthToken] = useState();
    const [currentUser, setCurrentUser] = useState();
    const [checking, setChecking] = useState(true);
    const [accountType, setAccountType] = useState();

    const openAuthModal = () => setAuthModalOpen(true);
    const closeAuthModal = () => setAuthModalOpen(false);

    const resetAllData = () => {
        setAuthToken(null);
        setCurrentUser(null);
        setAccountType(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('accountType');
    }

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
                if (res.data.user.is_active === 0) {
                    return toast.error("Tài khoản tạm thời bị khóa, vui lòng liên hệ với quản trị viên!")
                }
                setAuthToken(res.data.accessToken);
                setCurrentUser(res.data.user);
                setAccountType(res.data.accountType);
                closeAuthModal();
                toast.success(res.data.message, {
                    autoClose: 500,
                    pauseOnHover: false,
                    hideProgressBar: true
                });
                localStorage.setItem('accessToken', JSON.stringify(res.data.accessToken));
                localStorage.setItem('currentUser', JSON.stringify(res.data.user));
                localStorage.setItem('accountType', JSON.stringify(res.data.accountType));
            }
        })
        .catch((err) => {
            resetAllData();
            toast.error(err.response.data?.message);
        })
        .finally(() => setChecking(false))
    }

    async function handleLoginEmployee(username, password) {
        setChecking(true);
        axios.post(serverUrl + 'auth/login/employee', {
            username: username,
            password: password
        }, {
            withCredentials: true
        })
        .then((res) => {
            if (res.data) {
                if (res.data.user.is_active === 0) {
                    return toast.error("Tài khoản tạm thời bị khóa, vui lòng liên hệ với quản trị viên!");
                }
                setAuthToken(res.data.accessToken);
                setCurrentUser(res.data.user);
                setAccountType(res.data.accountType);
                toast.success(res.data.message);
                localStorage.setItem('accessToken', JSON.stringify(res.data.accessToken));
                localStorage.setItem('currentUser', JSON.stringify(res.data.user));
                localStorage.setItem('accountType', JSON.stringify(res.data.accountType));
            }
        })
        .catch((err) => {
            resetAllData();
            toast.error(err.response.data?.message);
        })
        .finally(() => setChecking(false))
    }

    async function handleLogout() {
        setChecking(true);
        axios.post(serverUrl + 'auth/logout', {}, {
            withCredentials: true
        })
        .then(() => {
            resetAllData();
        })
        .catch((error) => console.log(error))
        .finally(() => setChecking(false))
    }

    useLayoutEffect(() => {
        const authInterceptor = axios.interceptors.request.use(
            (config) => {
                if (!config.headers['Authorization'] && !config.url.includes("api.cloudinary.com")) {
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
                    axios.post(serverUrl + 'auth/refreshToken', {
                        accountType
                    }, {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true,
                    })
                    .then((res) => {
                        setAuthToken(res.data.accessToken);
                        setCurrentUser(res.data.user);
                        setAccountType(res.data.accountType);
                        localStorage.setItem('accessToken', JSON.stringify(res.data.accessToken));
                        localStorage.setItem('currentUser', JSON.stringify(res.data.user));
                        localStorage.setItem('accountType', JSON.stringify(res.data.accountType));

                        originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;

                        return axios(originalRequest);
                    })
                    .catch((error) => {
                        console.log(error)
                        resetAllData();
                    })
                }
                return Promise.reject(error);
            },
        );
        setChecking(false);

        return () => {
            axios.interceptors.response.eject(refreshInterceptor);
        }
    }, [authToken, accountType])

    useLayoutEffect(() => {
        setChecking(true);
        const refresh = async () => {
            axios.post(serverUrl + 'auth/refreshToken', {
                accountType: JSON.parse(localStorage.getItem('accountType'))
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            })
            .then((res) => {
                if (res.data.user.is_active === 0) {
                    resetAllData();
                    return toast.error("Tài khoản tạm thời bị khóa, vui lòng liên hệ với quản trị viên!")
                }
                setAuthToken(res.data.accessToken);
                setCurrentUser(res.data.user);
                setAccountType(res.data.accountType);
                localStorage.setItem('accessToken', JSON.stringify(res.data.accessToken));
                localStorage.setItem('currentUser', JSON.stringify(res.data.user));
                localStorage.setItem('accountType', JSON.stringify(res.data.accountType));
            })
            .catch((err) => {
                resetAllData();
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
            handleLogin,
            handleLogout,
            handleLoginEmployee,
            isAuthModalOpen,
            authToken,
            currentUser,
            checking,
            accountType
        }}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => useContext(AuthContext);

export { AuthContextProvider, useAuth }