import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

function useUserData() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const savedUrl = await AsyncStorage.getItem('apiUrl');
            const token = await AsyncStorage.getItem('accessToken');
            if (token) {
                try {
                    const response = await axios.get(`${await AsyncStorage.getItem('apiUrl')}/api/user/profile/`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setUser(response.data);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return { user, loading, error };
}

export default useUserData;
