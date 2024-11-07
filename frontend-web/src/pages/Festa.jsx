import { useState, useEffect } from "react";
import Alert from "../components/Alert";
import ModalForm from '../components/ModalForm';
import Table from '../components/Table';
import api from "../api";
import Swal from 'sweetalert2'
import formatDate from "../formatDate";
import withReactContent from 'sweetalert2-react-content'
import { NumericFormat } from 'react-number-format';

function Festa(){

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        data_inicio: '',
    });
    const [alerts, setAlerts] = useState([]);
    const [alertsBarracas, setAlertsBarracas] = useState([]);
    const [alertsCaixas, setAlertsCaixas] = useState([]);
    const [alertsProdutos, setAlertsProdutos] = useState([]);
    const [alertsEstoques, setAlertsEstoques] = useState([]);
    const [festa, setFesta] = useState(null);
    const [error, setError] = useState(null);
    const [barracasUsuarios, setBarracasUsuarios] = useState([]);
    const [barracas, setBarracas] = useState([]);
    const [caixas, setCaixas] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [produtos_festa, setProdutos_Festa] = useState([]);
    const [barracasFesta, setBarracasFesta] = useState([]);
    const [caixasFesta, setCaixasFesta] = useState([]);
    const [produtos_estoque, setProdutosEstoque] = useState([]);
    const [valor, setValor] = useState('');
    const [troco_inicial, setTrocoInicial] = useState('');
    const [quant, setQuant] = useState('');
    const [data, setData] = useState('');
    const [selectedProduto, setSelectedProduto] = useState(null);
    const [selectedBarraca, setSelectedBarraca] = useState(null);
    const [selectedCaixa, setSelectedCaixa] = useState(null);
    const [selectedUserResponsavel, setSelectedUserResponsavel] = useState(null);
    const [selectedProdutoEstoque, setSelectedProdutoEstoque] = useState(null);

    useEffect(() => {
        getFesta();
    }, []);

    useEffect(() => {
        if(festa){
            getCaixasFesta();
        }
    }, [festa]);

    const getFesta = () => {
        api.get("/api/festa-atual/")
            .then((res) => {
                if(res.data.id){
                    setFesta(res.data);
                    setError(null);
                }else{
                    setError(res.data.message);
                    setFesta(null);
                }
            })
            .catch((error) => {            
                setError(error.response.data.message || "Ocorreu um erro ao buscar a festa.");
                setFesta(null);
            });
    };

    const getBarracas = () => {
        if(festa){
            api.get("/api/barracas-ativas/")
            .then((res) => {
                setBarracas(res.data);
            })
            .catch((error) => console.error(error));
        }
    };

    const getCaixas = () => {
        if(festa){
            api.get("/api/groups/3/users/")
            .then((res) => {
                setCaixas(res.data);
            })
            .catch((error) => console.error(error));
        }
    };

    const getBarracasUsuarios = () => {
        if(festa){
            api.get("/api/groups/2/users/")
            .then((res) => {
                setBarracasUsuarios(res.data);
            })
            .catch((error) => console.error(error));
        }
    };

    const getBarracasFesta = () => {
        if(festa){
            api.get("/api/barraca_festa/")
            .then((res) => {
                setBarracasFesta(res.data);
            })
            .catch((error) => console.error(error));
        }
    };

    const getCaixasFesta = () => {
        if(festa){
            api.get("/api/caixa_festa/")
            .then((res) => {
                setCaixasFesta(res.data);
            })
            .catch((error) => console.error(error));
        }
    };

    const getProdutos = () => {
        if(festa){
            api.get("/api/produto/festa_atual/")
            .then((res) => {
                setProdutos(res.data);
            })
            .catch((error) => console.error(error));
        }
    };

    const getProdutos_Festa = () => {
        if(festa){
            api.get("/api/produto_festa/")
            .then((res) => {
                setProdutos_Festa(res.data);
            })
            .catch((error) => console.error(error));
        }
    };

    const getProdutosEstoque = () => {
        if(festa){
            api.get("/api/estoque/")
            .then((res) => {
                setProdutosEstoque(res.data);
            })
            .catch((error) => console.error(error));
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

    const addAlertsEstoques = (alert) => {
        setAlertsEstoques(prevAlerts => [
            ...prevAlerts,
            { 
                id: Date.now(), 
                ...alert 
            }
        ]);
    };

    const handleSubmitFesta = async (e) => {
        setIsLoading(true);
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
        } finally {
            setIsLoading(false);
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
            case '#atribuirEstoques':
                getProdutos();
                getProdutosEstoque();
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
                Swal.fire("Finalizado!", "A festa foi finalizada com sucesso.", "success").then(() => {
                    getFesta(); 
                });
            } else if (result.isDenied) {
                Swal.fire("A Festa não foi finalizada.", "", "info");
            }
        });
    };

    const fecharCaixa = () => {
        var options = { 0: "Selecione um Caixa" };
        
        caixasFesta.filter(caixa => caixa.finalizado === false).map(caixa => {
            options[caixa.id] = caixa.user_caixa_username;
        });

        withReactContent(Swal).fire({
            title: "Selecione um Caixa que deseja fechar e insira o troco final:",
            input: 'select',
            inputOptions: options,
            showDenyButton: true,
            confirmButtonText: "Sim",
            denyButtonText: "Não",
            showLoaderOnConfirm: true,
            html: `
                <input id="trocoFinalInput" class="swal2-input" type="text" placeholder="Troco Final (R$)" />
            `,
            didOpen: () => {
                const trocoFinalInput = document.getElementById('trocoFinalInput');
                trocoFinalInput.addEventListener('input', (e) => mascaraMoeda(e.target));
            },
            preConfirm: async (caixa) => {
                const trocoFinalFormatted = document.getElementById('trocoFinalInput').value;

                if (caixa == 0) {
                    Swal.showValidationMessage('Selecione um caixa!');
                    return false;
                }

                if (!trocoFinalFormatted || isNaN(formatToNumber(trocoFinalFormatted))) {
                    Swal.showValidationMessage('Insira um valor de troco final válido!');
                    return false;
                }

                const troco_final = formatToNumber(trocoFinalFormatted); // Converte o formato R$ para número

                try {
                    const response = await api.post('/api/fechar-caixa/', { caixa, troco_final });
                    return response.data;
                } catch (error) {
                    const errorMessage = error.response?.data?.message || "Ocorreu um erro desconhecido.";
                    Swal.showValidationMessage(`Erro: ${errorMessage}`);
                    return false;
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Finalizado!", "O Caixa foi finalizado com sucesso.", "success").then(() => {
                    getFesta(); 
                });
            } else if (result.isDenied) {
                Swal.fire("O Caixa não foi finalizado.", "", "info");
            }
        });
    };

    const formatToNumber = (formattedValue) => {
        return parseFloat(formattedValue.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
    };

    const mascaraMoeda = (input) => {
        let value = input.value.replace(/\D/g, "");
        value = (value / 100).toFixed(2) + ""; 
        value = value.replace(".", ","); 
        value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        input.value = "R$ " + value;
    };

    const handleAddBarraca = async (e) => {
        e.preventDefault();
        if(selectedBarraca !== null || selectedUserResponsavel !== null){
            setIsLoading(true);
            try {
                await api.post('/api/barraca_festa/', { barraca: parseInt(selectedBarraca, 10), user_responsavel: parseInt(selectedUserResponsavel, 10) });
                addAlertBarraca({ type: 'alert-success', title: 'Sucesso!', body: 'Usuario adicionado a barraca adicionada com sucesso!' });
                getBarracas();
                getBarracasFesta();
                getBarracasUsuarios();
            } catch (error) {
                addAlertBarraca({ type: 'alert-danger', title: 'Erro!', body: 'Ocorreu um erro ao adicionar a barraca. Erro: '+error.response.data.message  });
            } finally {
                setIsLoading(false);
            }
        }else{
            addAlertBarraca({ type: 'alert-warning', title: 'Atenção!', body: 'Preencha todos os campos!'  });
        }
    };

    const handleAddCaixa = async (e) => {
        e.preventDefault();
        if(selectedCaixa !== null){
            setIsLoading(true);
            try {
                await api.post('/api/caixa_festa/', { user_caixa: parseInt(selectedCaixa, 10) , troco_inicial: troco_inicial});
                addAlertCaixa({ type: 'alert-success', title: 'Sucesso!', body: 'Caixa adicionado com sucesso!' });
                getCaixas();
                getCaixasFesta();
            } catch (error) {
                addAlertCaixa({ type: 'alert-danger', title: 'Erro!', body: 'Ocorreu um erro ao adicionar a caixa. Erro: '+error.response.data.message  });
            } finally {
                setIsLoading(false);
            }
        }else{
            addAlertCaixa({ type: 'alert-warning', title: 'Atenção!', body: 'Preencha todos os campos!'  });
        }
    };

    const handleAddValorProduto = async (e) => {
        e.preventDefault();
        if(selectedProduto !== null){
            setIsLoading(true);
            try {
                await api.post(`/api/produto_festa/`, { produto: parseInt(selectedProduto, 10), valor: valor });
                addAlertProdutos({ type: 'alert-success', title: 'Sucesso!', body: 'Valor adicionado com sucesso!' });
                getProdutos();
                getProdutos_Festa();
            } catch (error) {
                addAlertProdutos({ type: 'alert-danger', title: 'Erro!', body: 'Ocorreu um erro ao adicionar valor. Erro: '+error.response.data.message  });
            } finally {
                setIsLoading(false);
            }
        }else{
            addAlertProdutos({ type: 'alert-warning', title: 'Atenção!', body: 'Preencha todos os campos!'  });
        }
    };

    const handleAddEstoqueProduto = async (e) => {
        e.preventDefault();
        if(selectedProdutoEstoque !== null){
            setIsLoading(true);
            try {
                await api.post(`/api/estoque/`, { produto: parseInt(selectedProdutoEstoque, 10), quant: quant, data: data });
                addAlertProdutos({ type: 'alert-success', title: 'Sucesso!', body: 'Estoque adicionado com sucesso!' });
                getProdutos();
                getProdutosEstoque();
                setData('');
                setQuant('');
            } catch (error) {
                addAlertsEstoques({ type: 'alert-danger', title: 'Erro!', body: 'Ocorreu um erro ao adicionar estoque. Erro: '+error.response.data.message  });
            } finally {
                setIsLoading(false);
            }
        }else{
            addAlertsEstoques({ type: 'alert-warning', title: 'Atenção!', body: 'Preencha todos os campos!'  });
        }
    };

    const handleDeleteBarraca = async (barraca) => {
        setIsLoading(true);
        try {
            await api.delete(`/api/barraca_festa/delete/${barraca.id}/`);
            addAlertBarraca({ type: 'alert-success', title: 'Sucesso!', body: 'Barraca removida com sucesso!' });
            getBarracas();
            getBarracasFesta();
            getBarracasUsuarios();
        } catch (error) {
            addAlertBarraca({ type: 'alert-danger', title: 'Erro!', body: 'Ocorreu um erro ao remover a barraca. Erro: '+error.response.data.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCaixa = async (caixa) => {
        try {
            await api.delete(`/api/caixa_festa/delete/${caixa.id}/`);
            addAlertCaixa({ type: 'alert-success', title: 'Sucesso!', body: 'Caixa removido com sucesso!' });
            getCaixas();
            getCaixasFesta();
        } catch (error) {
            addAlertCaixa({ type: 'alert-danger', title: 'Erro!', body: 'Ocorreu um erro ao remover caixa. Erro: '+error.response.data.message });
        }
    };

    const handleDeleteValorProduto = async (produto) => {
        try {
            await api.delete(`/api/produto_festa/delete/${produto.id}/`);
            addAlertProdutos({ type: 'alert-success', title: 'Sucesso!', body: 'Produto removido com sucesso!' });
            getProdutos_Festa();
            getProdutos();
        } catch (error) {
            addAlertProdutos({ type: 'alert-danger', title: 'Erro!', body: 'Ocorreu um erro ao remover o valor do produto. Erro: '+error.response.data.message });
        }
    };
    const handleDeleteEstoqueProduto = async (produto) => {
        try {
            await api.delete(`/api/estoque/delete/${produto.id}/`);
            addAlertsEstoques({ type: 'alert-success', title: 'Sucesso!', body: 'Estoque de Produto removido com sucesso!' });
            getProdutosEstoque();
            getProdutos();
        } catch (error) {
            addAlertsEstoques({ type: 'alert-danger', title: 'Erro!', body: 'Ocorreu um erro ao remover o estoque. Erro: '+error.response.data.message });
        }
    };

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
                                        <button type="button" className="btn btn-primary me-2 mt-2" data-bs-toggle="modal" data-bs-target="#iniciarFesta"><i className="align-middle me-2 fas fa-fw fa-plus"></i> Iniciar Nova Festa</button>
                                        <button type="button" onClick={finalizarFesta} className="btn btn-primary me-2 mt-2"><i className="align-middle me-2 fas fa-fw fa-lock"></i> Finalizar Festa</button>
                                        <button type="button" onClick={fecharCaixa} className="btn btn-primary me-2 mt-2"><i className="align-middle me-2 fas fa-fw fa-lock"></i> Fechar Caixa</button>
                                        <button type="button" className="btn btn-primary me-2 mt-2" data-bs-toggle="modal" data-bs-target="#atribuirBarracas" onClick={((e) => handleClickModal(e))}><i className="align-middle me-2 fas fa-fw fa-store"></i> Atribuir Barracas</button>
                                        <button type="button" className="btn btn-primary me-2 mt-2" data-bs-toggle="modal" data-bs-target="#atribuirCaixas" onClick={((e) => handleClickModal(e))}><i className="align-middle me-2 fas fa-fw fa-money-check-alt"></i> Atribuir Caixas</button>
                                        <button type="button" className="btn btn-primary me-2 mt-2" data-bs-toggle="modal" data-bs-target="#atribuirValorProdutos" onClick={((e) => handleClickModal(e))}><i className="align-middle me-2 far fa-fw fa-money-bill-alt"></i> Atribuir Valor Produtos</button>
                                        <button type="button" className="btn btn-primary me-2 mt-2" data-bs-toggle="modal" data-bs-target="#atribuirEstoques" onClick={((e) => handleClickModal(e))}><i className="align-middle me-2 fas fa-fw fa-dolly"></i> Atribuir Estoques</button>
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
                                        <button type="submit" className="btn btn-primary me-2"><i className="align-middle me-2 fas fa-fw fa-save"></i> Iniciar</button>
                                        <button type="reset" className="btn btn-primary me-2"><i className="align-middle me-2 fas fa-fw fa-brush"></i> Limpar</button>
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
                                        <select className="form-select" required onChange={(e) => setSelectedBarraca(e.target.value)}>
                                            <option value='none'>Selecione uma Barraca</option>
                                            {barracas.map(barraca => (
                                                <option key={barraca.id} value={barraca.id}>{barraca.nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">Responsavel</label>
                                        <select className="form-select" required onChange={(e) => setSelectedUserResponsavel(e.target.value)}>
                                            <option value='none'>Selecione um Responsavel</option>
                                            {barracasUsuarios.map(user => (
                                                <option key={user.id} value={user.id}>{user.username}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <button type="submit" className="btn btn-primary me-2"><i className="align-middle me-2 fas fa-fw fa-plus-square"></i> Adicionar</button>
                                        <button type="reset" className="btn btn-primary me-2"><i className="align-middle me-2 fas fa-fw fa-brush"></i> Limpar</button>
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
                                        <select className="form-select" required onChange={(e) => setSelectedCaixa(e.target.value)}>
                                            <option value='none'>Selecione um Usuario</option>
                                            {caixas.map(caixa => (
                                                <option key={caixa.id} value={caixa.id}>{caixa.username}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">Troco Inicial</label>
                                        <NumericFormat
                                            value={troco_inicial}
                                            onValueChange={(values) => setTrocoInicial(values.value)}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            prefix="R$ "
                                            decimalScale={2}
                                            fixedDecimalScale
                                            allowNegative={false}
                                            className="form-control"
                                            placeholder="R$ 0,00"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <button type="submit" className="btn btn-primary me-2"><i className="align-middle me-2 fas fa-fw fa-plus-square"></i> Adicionar</button>
                                        <button type="reset" className="btn btn-primary me-2"><i className="align-middle me-2 fas fa-fw fa-brush"></i> Limpar</button>
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
                                        <select className="form-select" required onChange={(e) => setSelectedProduto(e.target.value)}>
                                            <option value='none'>Selecione um Produto</option>
                                            {produtos.map(produto => (
                                                <option key={produto.id} value={produto.id}>{produto.nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">Valor</label>
                                        <NumericFormat
                                            value={valor}
                                            onValueChange={(values) => setValor(values.value)}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            prefix="R$ "
                                            decimalScale={2}
                                            fixedDecimalScale
                                            allowNegative={false}
                                            className="form-control"
                                            placeholder="R$ 0,00"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <button type="submit" className="btn btn-primary me-2"><i className="align-middle me-2 fas fa-fw fa-plus-square"></i> Adicionar</button>
                                        <button type="reset" className="btn btn-primary me-2"><i className="align-middle me-2 fas fa-fw fa-brush"></i> Limpar</button>
                                    </div>
                                </div>
                            }
                            footer={<Table headers={[{ label: 'Produto', key: 'produto_nome' },{ label: 'Valor', key: 'valor_formatado' },{ label: 'Actions', key: 'actions' }]} data={produtos_festa} actions={[{ icon: 'trash', func: handleDeleteValorProduto }]} />}
                            onSubmit={handleAddValorProduto}
                        />
                        <ModalForm 
                            className="modal-dialog-centered modal-lg" 
                            id="atribuirEstoques"
                            title="Atribuir Estoques"
                            body={
                                <div>
                                    <div className="response">
                                        {alertsEstoques.map(alert => (
                                            <Alert
                                                key={alert.id}
                                                className={alert.type}
                                                message={{ title: alert.title, body: alert.body }}
                                            />
                                        ))}
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">Produtos</label>
                                        <select className="form-select" required onChange={(e) => setSelectedProdutoEstoque(e.target.value)}>
                                            <option value='none'>Selecione um Produto</option>
                                            {produtos.filter(produto => produto.estocavel === true)
                                                .map(produto => (             
                                                    <option key={produto.id} value={produto.id}>
                                                        {produto.nome}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="row">
                                        <div className="mb-4 col-md-3">
                                            <label className="form-label">Quantidade</label>
                                            <input
                                                type="number"
                                                id="quant"
                                                name="quant"
                                                value={quant}
                                                onChange={(e) => setQuant(e.target.value)}
                                                required
                                                className="form-control"
                                                placeholder="Quantidade"
                                            />
                                        </div>
                                        <div className="mb-4 col-md-3">
                                            <label className="form-label">Data</label>
                                            <input
                                                type="date"
                                                id="data"
                                                name="data"
                                                value={data}
                                                onChange={(e) => setData(e.target.value)}
                                                required
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <button type="submit" className="btn btn-primary me-2"><i className="align-middle me-2 fas fa-fw fa-plus-square"></i> Adicionar</button>
                                        <button type="reset" className="btn btn-primary me-2"><i className="align-middle me-2 fas fa-fw fa-brush"></i> Limpar</button>
                                    </div>
                                </div>
                            }
                            footer={<Table headers={[{ label: 'Produto', key: 'produto_nome' },{ label: 'Quantidade', key: 'quant' },{ label: 'Data', key: 'data' },{ label: 'Actions', key: 'actions' }]} data={produtos_estoque} actions={[{ icon: 'trash', func: handleDeleteEstoqueProduto }]} />}
                            onSubmit={handleAddEstoqueProduto}
                        />
                    </div>
                </div>
            </div>
    );
}

export default Festa;
