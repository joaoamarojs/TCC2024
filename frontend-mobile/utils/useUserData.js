import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createApi from './api';

function useUserData() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = await AsyncStorage.getItem('accessToken');
            if (token) {
                try {
                    const api = await createApi(); 
                    
                    const response = await api.get('/api/user/profile/');
                    const userData = response.data;

                    const res = await api.post('/api/festa-atual/valida-user/', { user_id: userData.id });
                    userData.funcao = res.data.funcao;
                    if(userData.groups.includes(2)){
                        userData.barraca = res.data.barraca;
                    }
                    setUser(userData);
                } catch (error) {
                    if (error.response && error.response.data && error.response.data.message) {
                        setValidationError(error.response.data.message);
                    } else {
                        setError(error.message);
                    }
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return { user, loading, error, validationError };
}

export default useUserData;
