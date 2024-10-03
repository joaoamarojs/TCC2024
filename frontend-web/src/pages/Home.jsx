import { useState, useEffect } from "react";
import api from "../api";
import formatDate from "../formatDate";
import '../styles/Admin.css';

function Home(){

    const [festa, setFesta] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        getFesta();
    }, []);

    const getFesta = async () => {
        try {
            const response = await api.get("/api/festa-atual/");
            if(response.data.id){
                setFesta(response.data);
                setError(null);
            }else{
                setError(response.data.message);
                setFesta(null);
            }
        } catch (err) {
            setError(err.response.data.message || "Ocorreu um erro ao buscar a festa.");
            setFesta(null);
        }
    };

    return <div className="container-fluid p-0">
                <div className="row mb-2 mb-xl-3">
                    <div className="col-auto d-none d-sm-block">
                        <h3>Dashboard</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-6 col-xxl-5 d-flex">
                        <div className="w-100">
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col mt-0">
                                                    <h5 className="card-title">Festa Atual</h5>
                                                </div>

                                                <div className="col-auto">
                                                    <div className="stat text-primary"><i className="align-middle far fa-fw fa-gem"></i></div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col mt-0">
                                                    {error ? (
                                                        <span className="text-muted">{error}</span>
                                                    ) : festa ? (
                                                        <>
                                                            <div className="mb-0">
                                                                <span className="text-muted">Nome: {festa.nome}</span>
                                                            </div>
                                                            <div className="mb-0">
                                                                <span className="text-muted">Data de Início: {formatDate(festa.data_inicio)}</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <span className="text-muted">Carregando...</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
}

export default Home