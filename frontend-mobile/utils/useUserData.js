import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

function useUserData() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState(null); 

    useEffect(() => {
        const fetchUserData = async () => {
            const savedUrl = await AsyncStorage.getItem('apiUrl');
            const token = await AsyncStorage.getItem('accessToken');
            if (token) {
                try {
                    const response = await axios.get(`${savedUrl}/api/user/profile/`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Client-Type': 'mobile',
                        },
                    });
                    const userData = response.data;
                    setUser(userData);

                    await axios.post(`${savedUrl}/api/festa-atual/valida-user/`, {user_id: userData.id}, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Client-Type': 'mobile',
                        },
                    });
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
