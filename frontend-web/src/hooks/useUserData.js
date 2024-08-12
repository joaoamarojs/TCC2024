// src/hooks/useUserData.js
import { useState, useEffect } from 'react';
import { ACCESS_TOKEN } from "../constants"

function useUserData() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem(ACCESS_TOKEN);
            if (token) {
                try {
                    const response = await fetch('http://127.0.0.1:8000/api/user/profile/', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setUser(data);
                    } else {
                        setError('Failed to fetch user data');
                    }
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
