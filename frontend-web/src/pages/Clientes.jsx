import NavSideBar from "../components/NavSideBar";
import NavTopBar from "../components/NavTopBar";
import { useState, useEffect } from "react";
import Alert from "../components/Alert";
import Table from '../components/Table';
import api from "../api";
import MaskedInput from 'react-text-mask';

function Clientes(props){
    const { user} = props;

    const [alert, setAlert] = useState(null);
    const [clients, setClients] = useState([]);
    const [nome, setNome] = useState("");
    const [data_nascimento, setDataNascimento] = useState("");
    const [cpf, setCpf] = useState("");
    const [ativo, setAtivo] = useState(true);
    const [selectedClientId, setSelectedClientId] = useState(null);

    useEffect(() => {
        console.log('aaaaa')
        getClients();
    }, []);

    const getClients = () => {
        api.get("/api/cliente/")
            .then((res) => {
                setClients(res.data);
            })
            .catch((error) => 
            setAlert({
                type: 'alert-error',
                title: 'Erro!',
                body: error
            }));
    };

    const deleteClient = (id) => {
        api.delete(`/api/cliente/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) {
                    setAlert({
                        type: 'alert-success',
                        title: 'Sucesso!',
                        body: 'Cliente deletado com sucesso.'
                    });
                    getClients();
                } 
            })
            .catch((error) => 
            setAlert({
                type: 'alert-error',
                title: 'Erro!',
                body: 'Falhou em deletar usuário. Erro: '+error
            }));
    };

    const createClient = (e) => {
        e.preventDefault();
        const endpoint = selectedClientId ? `/api/cliente/${selectedClientId}/` : "/api/cliente/";
        const method = selectedClientId ? 'put' : 'post';

        api[method](endpoint, { nome, data_nascimento, cpf, ativo })
            .then((res) => {
                if (res.status === 201 || res.status === 200) {
                    setAlert({
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
                let errorMessage = 'Falhou em salvar usuário. Erro:';

                if (errorData.cpf) {
                    errorMessage += ` ${errorData.cpf.join(' ')}`;
                }

                setAlert({
                    type: 'alert-danger',
                    title: 'Erro!',
                    body: errorMessage
                });
            } else {
                setAlert({
                    type: 'alert-danger',
                    title: 'Erro!',
                    body: 'Falhou em salvar usuário. Erro desconhecido.'
                });
            }
        });
    };

    const editClient = (client) => {
        setSelectedClientId(client.id); 
        setNome(client.nome);
        setDataNascimento(client.data_nascimento); 
        setCpf(client.cpf); 
        setAtivo(client.ativo);
    };

    const handleCloseAlert = () => {
        setAlert(null);
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
        { label: 'Data Nascimento', key: 'data_nascimento' },
        { label: 'Cpf', key: 'cpf' },
        { label: 'Actions', key: 'actions' }
    ];

    const actions = [
        { icon: 'edit-2', func: (client) => editClient(client) },
        { icon: 'trash', func: (client) => deleteClient(client.id) }
    ];

    return (
            <div className="container-fluid p-0">
                <div className="row mb-2 mb-xl-3">
                    <div className="col-auto d-none d-sm-block">
                        <h3>Clientes</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title">Informações</h5>
                                <hr/>
                                <div className="response">        
                                    {alert && (
                                        <Alert
                                            className={alert.type}
                                            message={alert}
                                            onClose={handleCloseAlert}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="card-body">
                                <form onSubmit={createClient}>
                                    <div className="mb-4">
                                        <label className="form-label">Nome</label>
                                        <input type="text" id="nome" name="nome" required onChange={(e) => setNome(e.target.value)} value={nome} className="form-control" placeholder="Nome" />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">CPF</label>
                                        <MaskedInput type="text" id="cpf" name="cpf" mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/,  '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]} guide={false} required onChange={(e) => setCpf(e.target.value)} value={cpf} className="form-control" placeholder="000.000.000-00" />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">Data Nascimento</label>
                                        <input type="date" id="data_nascimento" name="data_nascimento" required onChange={(e) => setDataNascimento(e.target.value)} value={data_nascimento} className="form-control" />
                                    </div>
                                    <div className="form-check form-switch mb-4">
                                        <input className="form-check-input" type="checkbox" checked={ativo} onChange={() => setAtivo(!ativo)} />
                                        <label className="form-check-label">Ativo</label>
                                    </div>
                                    <div className="mb-4">
                                        <button type="submit" className="btn btn-primary me-2">
                                            {selectedClientId ? "Atualizar" : "Salvar"}
                                        </button>
                                        <button type="reset" className="btn btn-primary me-2" onClick={clearForm}>Limpar</button>
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
