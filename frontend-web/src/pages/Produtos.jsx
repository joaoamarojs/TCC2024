import { useState, useEffect } from "react";
import Alert from "../components/Alert";
import Table from '../components/Table';
import api from "../api";

function Produtos() {

  const [isLoading, setIsLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState("");
  const [selectedProdutoId, setSelectedProdutoId] = useState(null);
  const [tipo_produtos, setTipo_produtos] = useState([]);
  const [selectedTipo_produto, setSelectedTipo_produto] = useState('none');
  const [barracas, setBarracas] = useState([]);
  const [selectedBarraca, setSelectedBarraca] = useState('none');
  const [estocavel, setEstocavel] = useState(false);

  useEffect(() => {
    getProdutos();
    getTipo_produtos();
    getBarracas();
    return () => {};
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

  const getProdutos = () => {
    api.get("/api/produto/")
      .then((res) => {
        setProdutos(res.data);
      })
      .catch((error) => addAlert({
          type: 'alert-danger',
          title: 'Erro!',
          body: error
        }));
  };

  const getTipo_produtos = () => {
    api.get("/api/tipo_produto/")
      .then((res) => {
        setTipo_produtos(res.data);
      })
      .catch((error) => addAlert({
          type: 'alert-danger',
          title: 'Erro!',
          body: error
        }));
  };

  const getBarracas = () => {
    api.get("/api/barraca/")
      .then((res) => {
        setBarracas(res.data);
      })
      .catch((error) => addAlert({
          type: 'alert-danger',
          title: 'Erro!',
          body: error
        }));
  };

  const deleteProduto = (id) => {
    setIsLoading(true);
    api.delete(`/api/produto/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) addAlert({type: 'alert-success', title: 'Sucesso!', body: 'Produto deletado com sucesso.'});
        getProdutos();
      })
      .catch((error) => addAlert({
          type: 'alert-danger',
          title: 'Erro!',
          body: 'Falhou em deletar usuário.'+error
      }))
      .finally(()=>setIsLoading(false));
  };

  const createProduto = (e) => {
    e.preventDefault();
    const endpoint = selectedProdutoId ? `/api/produto/${selectedProdutoId}/` : "/api/produto/";
    const method = selectedProdutoId ? 'put' : 'post';
    if(selectedBarraca !== 'none' || selectedTipo_produto !== 'none'){
      setIsLoading(true);
      api[method](endpoint, { nome,  barraca: parseInt(selectedBarraca, 10), tipo_produto: parseInt(selectedTipo_produto, 10), estocavel })
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            addAlert({
              type: 'alert-success',
              title: 'Sucesso!',
              body: 'Produto salvo com sucesso.'
            });
            setSelectedProdutoId(null);
            setNome("");
            setSelectedTipo_produto('none');
            setSelectedBarraca('none');
            setEstocavel(false);
          }else{
            addAlert({
              type: 'alert-danger',
              title: 'Erro!',
              body: 'Falhou em salvar produto.'+res.statusText
            })
          }
          getProdutos();
        })
        .catch((error) => addAlert({ type: 'alert-danger',title: 'Erro!',body: 'Falhou em salvar produto. '+error}))
        .finally(()=>setIsLoading(false));
    }else{
      addAlert({
        type: 'alert-warning',
        title: 'Atenção!',
        body: 'Selecione um Tipo de Produto e Barraca.'
      });
    }
  };

  const clearForm = () => {
    setSelectedProdutoId(null);
    setNome("");
    setSelectedTipo_produto('none');
    setSelectedBarraca('none');
    setEstocavel(false);
  }

  const editProduto = (produto) => {
    setSelectedProdutoId(produto.id);
    setNome(produto.nome);
    setSelectedBarraca(produto.barraca ? produto.barraca :'none');
    setSelectedTipo_produto(produto.tipo_produto ? produto.tipo_produto :'none');
    setEstocavel(produto.estocavel);
  };

  const headers = [
    { label: 'Produto', key: 'nome' },
    { label: 'Barraca', key: 'barraca_nome' },
    { label: 'Tipo', key: 'tipo_produto_nome' },
    { label: 'Ações', key: 'actions' }
  ];

  const actions = [
    { icon: 'edit-2', func: (produto) => editProduto(produto) },
    { icon: 'trash', func: (produto) => deleteProduto(produto.id) }
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
                <h3>Produtos</h3>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-xl-6">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title">Informações</h5>
                    <hr />
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
                    <form onSubmit={createProduto}>
                      <div className="mb-4">
                        <label className="form-label">Nome</label>
                        <input type="text" id="nome_produto" name="nome" required onChange={(e) => setNome(e.target.value)} value={nome} className="form-control" placeholder="Produto"/>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-4">
                            <label className="form-label">Barraca</label>
                            <select className="form-select choices-single" value={selectedBarraca} onChange={(e) => setSelectedBarraca(e.target.value)}>
                                <option value='none'>Barraca</option>
                                {barracas.map((barraca) => (
                                    <option key={barraca.id} value={barraca.id}>{barraca.nome}</option>
                                ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-4">
                            <label className="form-label">Tipo Produto</label>
                            <select className="form-select" value={selectedTipo_produto} onChange={(e) => setSelectedTipo_produto(e.target.value)}>
                                <option value='none'>Tipo_Produto</option>
                                {tipo_produtos.map((tipo_produto) => (
                                    <option key={tipo_produto.id} value={tipo_produto.id}>{tipo_produto.nome}</option>
                                ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="form-check form-switch mb-4">
                        <input className="form-check-input" type="checkbox" checked={estocavel} onChange={() => setEstocavel(!estocavel)}/>
                        <label className="form-check-label">Estocavel?</label>
                      </div>
                      <div className="mb-4">
                        <button type="submit" className="btn btn-primary me-2">
                          <i className="align-middle me-2 fas fa-fw fa-save"></i>
                          {selectedProdutoId ? "Atualizar" : "Salvar"}
                        </button>
                        <button type="button" className="btn btn-primary me-2" onClick={clearForm}><i className="align-middle me-2 fas fa-fw fa-brush"></i> Limpar</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-xl-6">
                <div className="card">
                  <Table headers={headers} data={produtos} actions={actions} />
                </div>
              </div>
            </div>
          </div>
  );
}

export default Produtos;
