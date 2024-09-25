import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESS_TOKEN } from './constants'; 

const createApi = async () => {
    const apiUrl = await AsyncStorage.getItem('apiUrl');
    const apiInstance = axios.create({
        baseURL: apiUrl,
    });

    apiInstance.interceptors.request.use(
        async (config) => {
            const token = await AsyncStorage.getItem(ACCESS_TOKEN);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            config.headers['Client-Type'] = 'mobile';
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return apiInstance;
};

export default createApi;