import { useState, useEffect } from "react";
import Alert from "../components/Alert";
import Table from '../components/Table';
import api from "../api";

function Barracas(){

    const [isLoading, setIsLoading] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const [barracas, setBarracas] = useState([]);
    const [nome, setNome] = useState("");
    const [ativo, setAtivo] = useState(false);
    const [selectedBarracaId, setSelectedBarracaId] = useState(null);

    useEffect(() => {
        getBarracas();
    }, []);

    const addAlert = (alert) => {
        setAlerts(prevAlerts => [
            ...prevAlerts,
            { 
                id: Date.now(), 
                ...alert 
            }
        ]);
    };

    const getBarracas = () => {
        api.get("/api/barraca/")
            .then((res) => {
                setBarracas(res.data);
            })
            .catch((error) => 
            addAlert({
                type: 'alert-danger',
                title: 'Erro!',
                body: error
            }));
    };

    const deleteBarraca = (id) => {
        setIsLoading(true);
        api.delete(`/api/barraca/delete/${id}/`)
            .then((res) => {
                setIsLoading(false);
                if (res.status === 204) {
                    addAlert({
                        type: 'alert-success',
                        title: 'Sucesso!',
                        body: 'Barraca deletada com sucesso.'
                    });
                    getBarracas();
                } 
            })
            .catch((error) => {
            addAlert({
                type: 'alert-danger',
                title: 'Erro!',
                body: 'Falhou em deletar barraca. Erro: '+error
            })
            .finally(() => {
                setIsLoading(false);
            })
        });
    };

    const createBarraca = (e) => {
        setIsLoading(true);
        e.preventDefault();
        const endpoint = selectedBarracaId ? `/api/barraca/${selectedBarracaId}/` : "/api/barraca/";
        const method = selectedBarracaId ? 'put' : 'post';

        api[method](endpoint, { nome, ativo })
            .then((res) => {
                if (res.status === 201 || res.status === 200) {
                    setIsLoading(false);
                    addAlert({
                        type: 'alert-success',
                        title: 'Sucesso!',
                        body: 'Barraca salva com sucesso.'
                    });
                    setSelectedBarracaId(null);
                    setNome("");
                    setAtivo(false);
                    getBarracas();
                }
            })
            .catch((error) => {
                setIsLoading(false);
                if (error.response && error.response.data) {
                    addAlert({
                        type: 'alert-danger',
                        title: 'Erro!',
                        body: error.response.data || 'Ocorreu um erro ao salvar barraca.'
                    });
                } else {
                    addAlert({
                        type: 'alert-danger',
                        title: 'Erro!',
                        body: 'Falhou em salvar barraca. Erro desconhecido.'
                    });
                }
            })
            .finally(() => {
                setIsLoading(false);
        })
    };

    const editBarraca = (barraca) => {
        setSelectedBarracaId(barraca.id); 
        setNome(barraca.nome);
        setAtivo(barraca.ativo);
    };

    const clearForm = () => {
        setSelectedBarracaId(null);
        setNome("");
        setAtivo(false);
    }

    const headers = [
        { label: 'Nome', key: 'nome' },
        { label: 'Ações', key: 'actions' }
    ];

    const actions = [
        { icon: 'edit-2', func: (barraca) => editBarraca(barraca) },
        { icon: 'trash', func: (barraca) => deleteBarraca(barraca.id) }
    ];

    return (
            <div className="container-fluid p-0">
                {isLoading && (
                    <div className="loading-overlay">
                    <div className="spinner-border text-info" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    </div>
                )}
                <div className="row mb-2 mb-xl-3">
                    <div className="col-auto d-none d-sm-block">
                        <h3>Barracas</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-xl-6">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title">Informações</h5>
                                <hr/>
                                <div className="response">
                                    {alerts.map(alert => (
                                        <Alert
                                            key={alert.id}
                                            className={alert.type}
                                            message={{ title: alert.title, body: alert.body }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="card-body">
                                <form onSubmit={createBarraca}>
                                    <div className="mb-4">
                                        <label className="form-label">Nome</label>
                                        <input type="text" id="nome_barraca" name="nome" required onChange={(e) => setNome(e.target.value)} value={nome} className="form-control" placeholder="Nome" />
                                    </div>
                                    <div className="form-check form-switch mb-4">
                                        <input className="form-check-input" type="checkbox" checked={ativo} onChange={() => setAtivo(!ativo)}/>
                                        <label className="form-check-label">Ativo</label>
                                    </div>
                                    <div className="mb-4">
                                        <button type="submit" className="btn btn-primary me-2">
                                            <i className="align-middle me-2 fas fa-fw fa-save"></i>
                                            {selectedBarracaId ? "Atualizar" : "Salvar"}
                                        </button>
                                        <button type="reset" className="btn btn-primary me-2" onClick={clearForm}><i className="align-middle me-2 fas fa-fw fa-brush"></i> Limpar</button>
                                    </div>                                       
                                </form>
                            </div>
                        </div>    
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-xl-6">
                        <div className="card">
                            <Table headers={headers} data={barracas} actions={actions} />
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default Barracas;
