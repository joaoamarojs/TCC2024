import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants';
import { useState, useEffect } from 'react';
import NavSideBar from './NavSideBar';
import NavTopBar from './NavTopBar';
import Home from '../pages/Home';
import Usuarios from '../pages/Usuarios';
import Clientes from '../pages/Clientes';
import Tipo_produtos from '../pages/Tipo_produtos';
import Barracas from '../pages/Barracas';
import Produtos from '../pages/Produtos';

function ProtectedRoute() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(null);
    const [selectedPage, setSelectedPage] = useState(null);

    function Logout() {
        localStorage.clear()
        return <Navigate to="/login" />;
    }

    useEffect(() => {
        const auth = async () => {
            try {
                const token = localStorage.getItem(ACCESS_TOKEN);
                if (!token) {
                    setIsAuthorized(false);
                    return;
                }

                const decoded = jwtDecode(token);
                const tokenExpiration = decoded.exp;
                const now = Date.now() / 1000;

                if (tokenExpiration < now) {
                    await refreshToken();
                } else {
                    setIsAuthorized(true);
                }
            } catch (error) {
                setIsAuthorized(false);
            }
        };

        auth().then(() => fetchUserData().finally(() => setLoading(false)));
    }, []);

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
                    setError('Falhou em capturar os dados do usuario');
                }
            } catch (error) {
                setError(error.message);
            }
        }
    };

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post('/api/token/refresh/', {
                refresh: refreshToken,
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            setIsAuthorized(false);
        }
    };

    const renderPage = () => {
        switch (selectedPage) {
            case 'home':
                return <Home />;
            case 'usuarios':
                return <Usuarios />;
            case 'clientes':
                return <Clientes />;
            case 'produtos':
                return <Produtos />    
            case 'tipo_produto':
                return <Tipo_produtos />;
            case 'barracas':
                return <Barracas />;
            case 'logout':
                return <Logout />;  
            default:
                return <div></div>;
        }
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error && isAuthorized) {
        return <div>Erro ao carregar dados do usuário: {error}. Por favor recarregue a pagina.</div>;
    }

    return isAuthorized ? (
        <div className="wrapper">
            <NavSideBar name={user?.username} onSelectPage={setSelectedPage} />
            <div className="main">
                <NavTopBar />
                <main className="content">
                    {renderPage()}
                </main>
            </div>
        </div>
    ) : (
        <Logout />
    );
}

export default ProtectedRoute;

