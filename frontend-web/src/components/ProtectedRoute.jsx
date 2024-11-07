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
import Festa from '../pages/Festa';
import Cartoes from '../pages/Cartoes';
import Relatorios from '../pages/Relatorios';

function ProtectedRoute() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [selectedPage, setSelectedPage] = useState(null);

    function Logout() {
        localStorage.clear();
        return <Navigate to="/login" />;
    }

    useEffect(() => {
        const checkAuthorization = () => {
            const token = localStorage.getItem(ACCESS_TOKEN);
            if (!token) {
                setIsAuthorized(false);
                return;
            }
            const decoded = jwtDecode(token);
            const tokenExpiration = decoded.exp;
            const now = Date.now() / 1000;

            if (tokenExpiration > now) {
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        };

        checkAuthorization();
        if (isAuthorized) {
            fetchUserData().finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [selectedPage, isAuthorized]);

    const fetchUserData = async () => {
        try {
            const response = await api.get('/api/user/profile/');
            if (response.status === 200) {
                setUser(response.data);
            } else {
                setError('Falhou em capturar os dados do usuário');
            }
        } catch (error) {
            setError(error.message);
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
            case 'festa':
                return <Festa />;
            case 'cartoes':
                return <Cartoes />;
            case 'relatorios':
                return <Relatorios />;
            case 'logout':
                return <Logout />;  
            default:
                return <div></div>;
        }
    };

    if (loading) {
        return (
            <div className='container-fluid vh-100 d-flex justify-content-center align-items-center'>
                <div className="mb-2">
                    <div className="spinner-grow text-dark me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="spinner-grow text-primary me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="spinner-grow text-secondary me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error && isAuthorized) {
        return <div>Erro ao carregar dados do usuário: {error}. Por favor recarregue a página.</div>;
    }

    return isAuthorized ? (
        <div className="wrapper">
            <NavSideBar name={user?.first_name} onSelectPage={setSelectedPage} />
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

