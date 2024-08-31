import { useState, useEffect, useRef, cloneElement } from "react";
import Alert from "../components/Alert";
import ModalForm from '../components/ModalForm';
import Table from '../components/Table';
import api from "../api";
import Swal from 'sweetalert2'
import formatDate from "../formatDate";
import withReactContent from 'sweetalert2-react-content'

function Festa(){

    const [formData, setFormData] = useState({
        nome: '',
        data_inicio: '',
    });
    const [alerts, setAlerts] = useState([]);
    const [alertsBarracas, setAlertsBarracas] = useState([]);
    const [alertsCaixas, setAlertsCaixas] = useState([]);
    const [alertsProdutos, setAlertsProdutos] = useState([]);
    const [festa, setFesta] = useState(null);
    const [error, setError] = useState(null);
    const [barracasUsuarios, setBarracasUsuarios] = useState([]);
    const [barracas, setBarracas] = useState([]);
    const [caixas, setCaixas] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [produtos_festa, setProdutos_Festa] = useState([]);
    const [barracasFesta, setBarracasFesta] = useState([]);
    const [caixasFesta, setCaixasFesta] = useState([]);
    const [valor, setValor] = useState(null);
    const [selectedProduto, setSelectedProduto] = useState(null);
    const [selectedBarraca, setSelectedBarraca] = useState(null);
    const [selectedCaixa, setSelectedCaixa] = useState(null);
    const [selectedUserResponsavel, setSelectedUserResponsavel] = useState(null);

    useEffect(() => {
        getFesta();
    }, []);

    const getFesta = async () => {
        try {
            const response = await api.get("/api/festa-atual/");
            setFesta(response.data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError(err.response.data.message || "Ocorreu um erro ao buscar a festa.");
            setFesta(null);
        }
    };

    const getBarracas = async () => {
        try {
            const response = await api.get("/api/barracas-ativas/");
            setBarracas(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const getCaixas = async () => {
        try {
            const response = await api.get(`/api/groups/3/users/`);
            setCaixas(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const getBarracasUsuarios = async () => {
        try {
            const response = await api.get(`/api/groups/2/users/`);
            setBarracasUsuarios(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const getBarracasFesta = async () => {
        try {
            const response = await api.get("/api/barraca_festa/");
            setBarracasFesta(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const getCaixasFesta = async () => {
        try {
            const response = await api.get(`/api/caixa_festa/`);
            setCaixasFesta(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const getProdutos = async () => {
        try {
            const response = await api.get(`/api/produto/festa_atual/`);
            setProdutos(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const getProdutos_Festa = async () => {
        try {
            const response = await api.get(`/api/produto_festa/${festa.id}/`);
            setProdutos_Festa(response.data);
        } catch (err) {
            console.error(err);
        }
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const addAlert = (alert) => {
        setAlerts(prevAlerts => [
            ...prevAlerts,
            { 
                id: Date.now(), 
                ...alert 
            }
        ]);
    };

    const addAlertBarraca = (alert) => {
        setAlertsBarracas(prevAlerts => [
            ...prevAlerts,
            { 
                id: Date.now(), 
                ...alert 
            }
        ]);
    };

    const addAlertCaixa = (alert) => {
        setAlertsCaixas(prevAlerts => [
            ...prevAlerts,
            { 
                id: Date.now(), 
                ...alert 
            }
        ]);
    };

    const addAlertProdutos = (alert) => {
        setAlertsProdutos(prevAlerts => [
            ...prevAlerts,
            { 
                id: Date.now(), 
                ...alert 
            }
        ]);
    };

    const handleSubmitFesta = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/festa/', formData);
            addAlert({ type: 'alert-success', title: 'Sucesso!', body:  'Festa iniciada com sucesso!' });

            const modal = document.getElementById('iniciarFesta');
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
            getFesta();
        } catch (error) {
            const errorMessage = error.response.data.message || 'Ocorreu um erro ao iniciar a festa.';
            addAlert({ type: 'alert-danger', title: 'Erro!', body: errorMessage });

            const modal = document.getElementById('iniciarFesta');
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
        }
    }


    const handleClickModal = async (e) => {
        getFesta();
        switch (e.target.getAttribute('data-bs-target')) {
            case '#atribuirBarracas':
                getBarracas();
                getBarracasUsuarios();
                getBarracasFesta();
            case '#atribuirCaixas':
                getCaixas();
                getCaixasFesta();
            case '#atribuirValorProdutos':
                getProdutos();
                getProdutos_Festa();
        }
    }

    const finalizarFesta = () => {
        withReactContent(Swal).fire({
            title: "Você quer mesmo finalizar a festa atual?",
            input: 'password',
            inputLabel: 'Digite a senha',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showDenyButton: true,
            confirmButtonText: "Sim",
            denyButtonText: "Não",
            showLoaderOnConfirm: true,
            preConfirm: async (password) => {
                if (!password) {
                    Swal.showValidationMessage('A senha é obrigatória');
                    return false; 
                }
                
                try {
                    const response = await api.post('/api/fechar-festa/', { password });
                    return response.data;
                } catch (error) {
                    const errorMessage = error.response.data.message || "Ocorreu um erro desconhecido.";
                    Swal.showValidationMessage(`Erro: ${errorMessage}`);
                    return false;
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Finalizado!", "O evento foi finalizado com sucesso.", "success").then(() => {
                    getFesta(); 
                });
            } else if (result.isDenied) {
                Swal.fire("O evento não foi finalizado.", "", "info");
            }
        });
    };

    const handleAddBarraca = async (e) => {
        console.log('wqeweqwe')
        e.preventDefault();
        try {
            await api.post('/api/barraca_festa/', { barraca: parseInt(selectedBarraca, 10), user_responsavel: parseInt(selectedUserResponsavel, 10), festa: festa.id });
            addAlertBarraca({ type: 'alert-success', title: 'Sucesso!', body: 'Usuario adicionado a barraca adicionada com sucesso!' });
            getBarracas();
            getBarracasFesta();
            getBarracasUsuarios();
        } catch (error) {
            console.log(error.response.data.message)
            addAlertBarraca({ type: 'alert-danger', title: 'Erro!', body: 'Ocorreu um erro ao adicionar a barraca. Erro: '+error.response.data.message  });
        }
    };

    const handleAddCaixa = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/caixa_festa/', { user_caixa: parseInt(selectedCaixa, 10), festa: festa.id });
            addAlertCaixa({ type: 'alert-success', title: 'Sucesso!', body: 'Caixa adicionado com sucesso!' });
            getCaixas();
            getCaixasFesta();
        } catch (error) {
            addAlertCaixa({ type: 'alert-danger', title: 'Erro!', body: 'Ocorreu um erro ao adicionar a caixa. Erro: '+error.response.data.message  });
        }
    };

    const handleAddValorProduto = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/produto_festa/', { produto: parseInt(selectedProduto, 10), valor: valor,festa: festa.id });
            addAlertProdutos({ type: 'alert-success', title: 'Sucesso!', body: 'Valor adicionado com sucesso!' });
            getProdutos();
            getProdutos_Festa();
        } catch (error) {
            addAlertProdutos({ type: 'alert-danger', title: 'Erro!', body: 'Ocorreu um erro ao adicionar valor. Erro: '+error.response.data.message  });
        }
    };

    const handleDeleteBarraca = async (barraca) => {
        try {
            await api.delete(`/api/barraca_festa/delete/${barraca.id}/`);
            addAlertBarraca({ type: 'alert-success', title: 'Sucesso!', body: 'Barraca removida com sucesso!' });
            getBarracas();
            getBarracasFesta();
            getBarracasUsuarios();
        } catch (error) {
            addAlertBarraca({ type: 'alert-danger', title: 'Erro!', body: 'Ocorreu um erro ao remover a barraca. Erro: '+error.response.data.message });
        }
    };

    const handleDeleteCaixa = async (caixa) => {
        try {
            await api.delete(`/api/caixa_festa/delete/${caixa.id}/`);
            addAlertCaixa({ type: 'alert-success', title: 'Sucesso!', body: 'Caixa removido com sucesso!' });
            getCaixas();
            getCaixasFesta();
        } catch (error) {
            addAlertCaixa({ type: 'alert-danger', title: 'Erro!', body: 'Ocorreu um erro ao remover a caixa. Erro: '+error.response.data.message });
        }
    };

    const handleDeleteValorProduto = async (produto) => {
        try {
            await api.delete(`/api/produto_festa/delete/${produto.id}/`);
            addAlertProdutos({ type: 'alert-success', title: 'Sucesso!', body: 'Produto removido com sucesso!' });
            getProdutos_Festa();
            getProdutos();
        } catch (error) {
            addAlertProdutos({ type: 'alert-danger', title: 'Erro!', body: 'Ocorreu um erro ao remover a caixa. Erro: '+error.response.data.message });
        }
    };

    return (
            <div className="container-fluid p-0">
                <div className="row mb-2 mb-xl-3">
                    <div className="col-auto d-none d-sm-block">
                        <h3>Gerenciar Festa</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
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
                                {
                                    error ? (
                                            <span className="text-muted">{error}</span>
                                    ) : festa ? (
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item">Nome: {festa.nome}</li>
                                            <li className="list-group-item">Data de Início: {formatDate(festa.data_inicio)}</li>
                                        </ul>
                                        ) : (
                                            <span className="text-muted">Nenhuma festa em aberto...</span>
                                        )
                                }
                            </div>
                            <div className="card-body">
                                <form>
                                    <div className="mb-4">
                                        <button type="button" className="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#iniciarFesta">Iniciar Nova Festa</button>
                                        <button type="button" onClick={finalizarFesta} className="btn btn-primary me-2">Finalizar Festa</button>
                                        <button type="button" className="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#atribuirBarracas" onClick={((e) => handleClickModal(e))}>Atribuir Barracas</button>
                                        <button type="button" className="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#atribuirCaixas" onClick={((e) => handleClickModal(e))}>Atribuir Caixas</button>
                                        <button type="button" className="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#atribuirValorProdutos" onClick={((e) => handleClickModal(e))}>Atribuir Valor Produtos</button>
                                    </div>                                       
                                </form>
                            </div>
                        </div>    
                    </div>
                    <div className="modals">
                        <ModalForm 
                            className="modal-dialog-centered modal-lg" 
                            id="iniciarFesta"
                            title="Iniciar Nova Festa"
                            body={
                                <div>
                                    <div className="mb-4">
                                        <label className="form-label">Nome</label>
                                        <input
                                            type="text"
                                            id="nome_festa"
                                            name="nome"
                                            value={formData.nome}
                                            onChange={handleChange}
                                            required
                                            className="form-control"
                                            placeholder="Nome"
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="mb-4 col-md-3">
                                            <label className="form-label">Data inicio</label>
                                            <input
                                                type="date"
                                                id="data_inicio"
                                                name="data_inicio"
                                                value={formData.data_inicio}
                                                onChange={handleChange}
                                                required
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                </div>
                            }
                            footer={                                    
                                    <div className="mb-4">
                                        <button type="submit" className="btn btn-primary me-2">Salvar</button>
                                        <button type="reset" className="btn btn-primary me-2">Limpar</button>
                                    </div> 
                            }
                            onSubmit={handleSubmitFesta}
                        />
                        <ModalForm 
                            className="modal-dialog-centered modal-lg" 
                            id="atribuirBarracas"
                            title="Atribuir Barracas"
                            body={
                                <div>
                                    <div className="response">
                                        {alertsBarracas.map(alert => (
                                            <Alert
                                                key={alert.id}
                                                className={alert.type}
                                                message={{ title: alert.title, body: alert.body }}
                                            />
                                        ))}
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">Barracas</label>
                                        <select className="form-select" onChange={(e) => setSelectedBarraca(e.target.value)}>
                                            <option value='none'>Selecione uma Barraca</option>
                                            {barracas.map(barraca => (
                                                <option key={barraca.id} value={barraca.id}>{barraca.nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">Responsavel</label>
                                        <select className="form-select" onChange={(e) => setSelectedUserResponsavel(e.target.value)}>
                                            <option value='none'>Selecione um Responsavel</option>
                                            {barracasUsuarios.map(user => (
                                                <option key={user.id} value={user.id}>{user.username}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <button type="submit" className="btn btn-primary me-2">Adicionar</button>
                                        <button type="reset" className="btn btn-primary me-2">Limpar</button>
                                    </div>
                                </div>    
                            }
                            footer={<Table headers={[{ label: 'Barraca', key: 'barraca_nome' },{ label: 'Responsavel', key: 'user_responsavel_username' },{ label: 'Actions', key: 'actions' }]} data={barracasFesta} actions={[{ icon: 'trash', func: handleDeleteBarraca }]} />}
                            onSubmit={handleAddBarraca}
                        />
                        <ModalForm 
                            className="modal-dialog-centered modal-lg" 
                            id="atribuirCaixas"
                            title="Atribuir Caixas"
                            body={
                                <div>
                                    <div className="response">
                                        {alertsCaixas.map(alert => (
                                            <Alert
                                                key={alert.id}
                                                className={alert.type}
                                                message={{ title: alert.title, body: alert.body }}
                                            />
                                        ))}
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">Caixas</label>
                                        <select className="form-select" onChange={(e) => setSelectedCaixa(e.target.value)}>
                                            <option value='none'>Selecione um Usuario</option>
                                            {caixas.map(caixa => (
                                                <option key={caixa.id} value={caixa.id}>{caixa.username}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <button type="submit" className="btn btn-primary me-2">Adicionar</button>
                                        <button type="reset" className="btn btn-primary me-2">Limpar</button>
                                    </div>
                                </div>
                            }
                            footer={<Table headers={[{ label: 'Usuario', key: 'user_caixa_username' },{ label: 'Actions', key: 'actions' }]} data={caixasFesta} actions={[{ icon: 'trash', func: handleDeleteCaixa }]} />}
                            onSubmit={handleAddCaixa}
                        />
                        <ModalForm 
                            className="modal-dialog-centered modal-lg" 
                            id="atribuirValorProdutos"
                            title="Atribuir Valor Produtos"
                            body={
                                <div>
                                    <div className="response">
                                        {alertsProdutos.map(alert => (
                                            <Alert
                                                key={alert.id}
                                                className={alert.type}
                                                message={{ title: alert.title, body: alert.body }}
                                            />
                                        ))}
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">Produtos</label>
                                        <select className="form-select" onChange={(e) => setSelectedProduto(e.target.value)}>
                                            <option value='none'>Selecione um Produto</option>
                                            {produtos.map(produto => (
                                                <option key={produto.id} value={produto.id}>{produto.nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">Valor</label>
                                        <input type="text" id="valor" name="valor" required onChange={(e) => setValor(e.target.value)} value={valor} className="form-control" placeholder="Valor"/>
                                    </div>
                                    <div className="mb-4">
                                        <button type="submit" className="btn btn-primary me-2">Adicionar</button>
                                        <button type="reset" className="btn btn-primary me-2">Limpar</button>
                                    </div>
                                </div>
                            }
                            footer={<Table headers={[{ label: 'Produto', key: 'produto_nome' },{ label: 'Valor', key: 'valor' },{ label: 'Actions', key: 'actions' }]} data={produtos_festa} actions={[{ icon: 'trash', func: handleDeleteValorProduto }]} />}
                            onSubmit={handleAddValorProduto}
                        />
                    </div>
                </div>
            </div>
    );
}

export default Festa;
