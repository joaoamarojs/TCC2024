import { useState, useEffect } from "react";
import Alert from "../components/Alert";
import Table from '../components/Table';
import api from "../api";
import MaskedInput from 'react-text-mask';

function Clientes(){

    const [isLoading, setIsLoading] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const [clients, setClients] = useState([]);
    const [nome, setNome] = useState("");
    const [data_nascimento, setDataNascimento] = useState("");
    const [cpf, setCpf] = useState("");
    const [ativo, setAtivo] = useState(true);
    const [selectedClientId, setSelectedClientId] = useState(null);

    useEffect(() => {
        getClients();
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

    const getClients = () => {
        api.get("/api/cliente/")
            .then((res) => {
                setClients(res.data);
            })
            .catch((error) => 
            addAlert({
                type: 'alert-danger',
                title: 'Erro!',
                body: error
            }));
    };

    const deleteClient = (id) => {
        setIsLoading(true);
        api.delete(`/api/cliente/delete/${id}/`)
            .then((res) => {
                setIsLoading(false);
                if (res.status === 204) {
                    addAlert({
                        type: 'alert-success',
                        title: 'Sucesso!',
                        body: 'Cliente deletado com sucesso.'
                    });
                    getClients();
                } 
            })
            .catch((error) => {
            addAlert({
                type: 'alert-danger',
                title: 'Erro!',
                body: 'Falhou em deletar cliente. Erro: '+error
            }).finally(() => {
                setIsLoading(false);
            })
        });
    };

    const createClient = (e) => {
        setIsLoading(true);
        e.preventDefault();
        const endpoint = selectedClientId ? `/api/cliente/${selectedClientId}/` : "/api/cliente/";
        const method = selectedClientId ? 'put' : 'post';

        api[method](endpoint, { nome, data_nascimento, cpf, ativo })
            .then((res) => {
                if (res.status === 201 || res.status === 200) {
                    addAlert({
                        type: 'alert-success',
                        title: 'Sucesso!',
                        body: 'Cliente salvo com sucesso.'
                    });
                    setSelectedClientId(null);
                    setNome("");
                    setCpf("");
                    setDataNascimento("");
                    setAtivo(true);
                    getClients();
                }
            })
            .catch((error) => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                let errorMessage = 'Falhou em salvar cliente. Erro:';

                if (errorData.cpf) {
                    errorMessage += ` ${errorData.cpf.join(' ')}`;
                }

                addAlert({
                    type: 'alert-danger',
                    title: 'Erro!',
                    body: errorMessage
                });
            } else {
                addAlert({
                    type: 'alert-danger',
                    title: 'Erro!',
                    body: 'Falhou em salvar cliente. Erro desconhecido.'
                });
            }
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    const editClient = (client) => {
        setSelectedClientId(client.id); 
        setNome(client.nome);
        setDataNascimento(client.data_nascimento); 
        setCpf(client.cpf); 
        setAtivo(client.ativo);
    };

    const clearForm = () => {
        setSelectedClientId(null);
        setNome("");
        setCpf("");
        setDataNascimento("");
        setAtivo(true);
    }

    const headers = [
        { label: 'Nome', key: 'nome' },
        { label: 'Data Nascimento', key: 'data_nascimento_formatada' },
        { label: 'Cpf', key: 'cpf' },
        { label: 'Ações', key: 'actions' }
    ];

    const actions = [
        { icon: 'edit-2', func: (client) => editClient(client) },
        { icon: 'trash', func: (client) => deleteClient(client.id) }
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
                        <h3>Clientes</h3>
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
                                            className={alert.type} // Adicione classes adicionais se necessário
                                            message={{ title: alert.title, body: alert.body }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="card-body">
                                <form onSubmit={createClient}>
                                    <div className="mb-4">
                                        <label className="form-label">Nome</label>
                                        <input type="text" id="nome_cliente" name="nome" required onChange={(e) => setNome(e.target.value)} value={nome} className="form-control" placeholder="Nome" />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-4">
                                                <label className="form-label">CPF</label>
                                                <MaskedInput type="text" id="cpf" name="cpf" mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/,  '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]} guide={false} required onChange={(e) => setCpf(e.target.value)} value={cpf} className="form-control" placeholder="000.000.000-00" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-4">
                                                <label className="form-label">Data Nascimento</label>
                                                <input type="date" id="data_nascimento" name="data_nascimento" required onChange={(e) => setDataNascimento(e.target.value)} value={data_nascimento} className="form-control" />
                                            </div>
                                        </div>
                                    </div>                    
                                    <div className="form-check form-switch mb-4">
                                        <input className="form-check-input" type="checkbox" checked={ativo} onChange={() => setAtivo(!ativo)} />
                                        <label className="form-check-label">Ativo</label>
                                    </div>
                                    <div className="mb-4">
                                        <button type="submit" className="btn btn-primary me-2">
                                        <i className="align-middle me-2 fas fa-fw fa-save"></i>
                                            {selectedClientId ? "Atualizar" : "Salvar"}
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
                            <Table headers={headers} data={clients} actions={actions} />
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default Clientes;
