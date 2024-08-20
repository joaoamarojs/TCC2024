import { useState, useEffect } from "react";
import Alert from "../components/Alert";
import Table from '../components/Table';
import api from "../api";

function Tipo_produtos(){

    const [alert, setAlert] = useState(null);
    const [tipo_produtos, setTipo_produtos] = useState([]);
    const [nome, setNome] = useState("");
    const [selectedTipo_produtoId, setSelectedTipo_produtoId] = useState(null);

    useEffect(() => {
        getTipo_produtos();
    }, []);

    const getTipo_produtos = () => {
        api.get("/api/tipo_produto/")
            .then((res) => {
                setTipo_produtos(res.data);
            })
            .catch((error) => 
            setAlert({
                type: 'alert-error',
                title: 'Erro!',
                body: error
            }));
    };

    const deleteTipo_produto = (id) => {
        api.delete(`/api/tipo_produto/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) {
                    setAlert({
                        type: 'alert-success',
                        title: 'Sucesso!',
                        body: 'Tipo de Produto deletado com sucesso.'
                    });
                    getTipo_produtos();
                } 
            })
            .catch((error) => 
            setAlert({
                type: 'alert-error',
                title: 'Erro!',
                body: 'Falhou em deletar usuário. Erro: '+error
            }));
    };

    const createTipo_produto = (e) => {
        e.preventDefault();
        const endpoint = selectedTipo_produtoId ? `/api/tipo_produto/${selectedTipo_produtoId}/` : "/api/tipo_produto/";
        const method = selectedTipo_produtoId ? 'put' : 'post';

        api[method](endpoint, { nome })
            .then((res) => {
                if (res.status === 201 || res.status === 200) {
                    setAlert({
                        type: 'alert-success',
                        title: 'Sucesso!',
                        body: 'Tipo de Produto salvo com sucesso.'
                    });
                    setSelectedTipo_produtoId(null);
                    setNome("");
                    getTipo_produtos();
                }
            })
            .catch((error) => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                let errorMessage = 'Falhou em salvar tipo_produto. Erro:';

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
                    body: 'Falhou em salvar tipo_produto. Erro desconhecido.'
                });
            }
        });
    };

    const editTipo_produto = (tipo_produto) => {
        setSelectedTipo_produtoId(tipo_produto.id); 
        setNome(tipo_produto.nome);
    };

    const handleCloseAlert = () => {
        setAlert(null);
    };

    const clearForm = () => {
        setSelectedTipo_produtoId(null);
        setNome("");
    }

    const headers = [
        { label: 'Nome', key: 'nome' },
        { label: 'Actions', key: 'actions' }
    ];

    const actions = [
        { icon: 'edit-2', func: (tipo_produto) => editTipo_produto(tipo_produto) },
        { icon: 'trash', func: (tipo_produto) => deleteTipo_produto(tipo_produto.id) }
    ];

    return (
            <div className="container-fluid p-0">
                <div className="row mb-2 mb-xl-3">
                    <div className="col-auto d-none d-sm-block">
                        <h3>Tipos de Produtos</h3>
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
                                <form onSubmit={createTipo_produto}>
                                    <div className="mb-4">
                                        <label className="form-label">Nome</label>
                                        <input type="text" id="nome" name="nome" required onChange={(e) => setNome(e.target.value)} value={nome} className="form-control" placeholder="Nome" />
                                    </div>
                                    <div className="mb-4">
                                        <button type="submit" className="btn btn-primary me-2">
                                            {selectedTipo_produtoId ? "Atualizar" : "Salvar"}
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
                            <Table headers={headers} data={tipo_produtos} actions={actions} />
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default Tipo_produtos;
