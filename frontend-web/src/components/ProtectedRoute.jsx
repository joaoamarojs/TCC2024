import {Navigate} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
import { useState, useEffect, cloneElement } from "react"
import useUserData from '../hooks/useUserData';
import Home from "../pages/Home"
import Usuarios from "../pages/Usuarios"
import Clientes from "../pages/Clientes"
import NavSideBar from "./NavSideBar"
import NavTopBar from "./NavTopBar"

function ProtectedRoute({children}){
    const { user, loading: userLoading, error: userError } = useUserData();
    const [isAuthorized, setIsAuthorized] = useState(null);
    const [selectedPage, setSelectedPage] = useState('home');

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])
    
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try {
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });
            if(res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            }else{
                setIsAuthorized(false)
            }
        } catch(error){
            console.log(error)
            setIsAuthorized(false)
        }
    }

    const auth = async () =>{
        const token = localStorage.getItem(ACCESS_TOKEN)
        if(!token){
            setIsAuthorized(false);
            return;
        }
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        if(tokenExpiration < now){
            await refreshToken();
        }else{
            setIsAuthorized(true);
        }
    }

    if (userLoading || isAuthorized === null) {
        return <div>Carregando...</div>;
    }

    if (userError) {
        return <div>Erro ao carregar dados do usuário: {userError}</div>;
    }

    const renderPage = () => {
        switch (selectedPage) {
            case 'home':
                return <Home user={user} />;
            case 'usuarios':
                return <Usuarios user={user} />;
            case 'clientes':
                return <Clientes user={user} />;
            default:
                return <div>Página não encontrada.</div>;
        }
    };

    return isAuthorized ? (
        <div className="wrapper">
            <NavSideBar name={user.username} onSelectPage={setSelectedPage} />
            <div className="main">
                <NavTopBar />
                <main className="content">
                    {renderPage()}
                </main>
            </div>    
        </div>
    ) : (
        <Navigate to="/login" />
    );
}

export default ProtectedRoute
