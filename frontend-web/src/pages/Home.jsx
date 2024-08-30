import { useState, useEffect } from "react";
import api from "../api";
import '../styles/Admin.css';

function Home(){

    const [evento, setEvento] = useState(null);

    useEffect(() => {
        getEvento();
    }, []);

    const getEvento = () => {
        api.get("/api/festa-atual/")
            .then((res) => {
                setEvento(res.data);
            })
            .catch((error) => alert(error));
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
                                                    <div className="stat text-primary"></div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col mt-0">
                                                    {
                                                    evento ? (
                                                        <>
                                                            <div className="mb-0">
                                                                <span className="text-muted">Nome: {evento.nome}</span>
                                                            </div>
                                                            <div className="mb-0">
                                                                <span className="text-muted">Data de Início: {evento.data_inicio}</span>
                                                            </div>
                                                        </>
                                                        ) : (
                                                            <span className="text-muted">Carregando...</span>
                                                        )
                                                    }
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