import axios from "axios"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        config.headers['Client-Type'] = 'web';
        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
);

const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken) return null;
    
    try {
        const res = await api.post('/api/token/refresh/', { refresh: refreshToken });
        if (res.status === 200) {
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            return res.data.access;
        }else{
            localStorage.clear();
        }
    } catch (error) {
        console.error("Erro ao tentar fazer o refresh do token:", error);
    }
    return null;
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Verifica se a resposta é 401 e se já não tentou o refresh antes
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                // Atualiza o cabeçalho da requisição com o novo token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            }
        }
        return Promise.reject(error);
    }
);

export default api