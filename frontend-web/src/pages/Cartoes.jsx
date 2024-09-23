import React, { useState, useEffect } from "react";
import ModalForm from '../components/ModalForm';
import Alert from "../components/Alert";
import Table from '../components/Table';
import api from "../api";

function Cartoes() {

  const [alerts, setAlerts] = useState([]);
  const [alertsCartoes, setAlertsCartoes] = useState([]);
  const [cartoes, setCartoes] = useState([]);
  const [nome, setNome] = useState("");
  const [selectedCartaoId, setSelectedCartaoId] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState('none');
  const [ativo, setAtivo] = useState(false);

  useEffect(() => {
    getCartoes();
    getClientes();
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

  const addAlertCartoes = (alert) => {
      setAlertsCartoes(prevAlerts => [
          ...prevAlerts,
          { 
              id: Date.now(), 
              ...alert 
          }
      ]);
  };

  const getCartoes = () => {
    api.get("/api/cartao/")
      .then((res) => res.data)
      .then((data) => {
        setCartoes(data);
      })
      .catch((error) => addAlertCartoes({
          type: 'alert-danger',
          title: 'Erro!',
          body: error
        }));
  };

  const getClientes = () => {
    api.get("/api/cliente/")
      .then((res) => res.data)
      .then((data) => {
        setClientes(data);
      })
      .catch((error) => addAlertCartoes({
          type: 'alert-danger',
          title: 'Erro!',
          body: error
        }));
  };

  const deleteCartao = (id) => {
    api.delete(`/api/cartao/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) addAlertCartoes({type: 'alert-success', title: 'Sucesso!', body: 'Cartao deletado com sucesso.'});
        getCartoes();
      })
      .catch((error) => addAlertCartoes({
          type: 'alert-danger',
          title: 'Erro!',
          body: 'Falhou em deletar usuário.'+error
        }));
  };

  const createCartao = (e) => {
    e.preventDefault();
    if(selectedCartaoId !== 'none' || selectedCliente !== 'none'){
      api.put(`/api/cartao/${selectedCartaoId}/`, { cliente: parseInt(selectedCliente, 10), ativo })
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            addAlertCartoes({
              type: 'alert-success',
              title: 'Sucesso!',
              body: 'Cartão salvo com sucesso.'
            });
            setSelectedCartaoId(null);
            setNome("");
            setSelectedCliente('none');
            setAtivo(false);
          }else{
            addAlertCartoes({
              type: 'alert-danger',
              title: 'Erro!',
              body: 'Falhou em salvar cartão.'+res.statusText
            })
          }
          getCartoes();
        })
        .catch((error) => addAlertCartoes({ type: 'alert-danger',title: 'Erro!',body: 'Falhou em salvar cartao. '+error}));
    }else{
      addAlertCartoes({
        type: 'alert-warning',
        title: 'Atenção!',
        body: 'Selecione um Cartão e Cliente.'
      });
    }
  };

  const editCartao = (cartao) => {
    setSelectedCartaoId(cartao.id);
    setNome(cartao.id);
    setSelectedCliente(cartao.cliente ? cartao.cliente :'none');
    setAtivo(cartao.ativo);
  };

  const gerarIndividual = () => {}
  const gerarNovoLote = () => {}

  return (
          <div className="container-fluid p-0">
            <div className="row mb-2 mb-xl-3">
              <div className="col-auto d-none d-sm-block">
                <h3>Cartões</h3>
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
                                className={alert.type} // Adicione classes adicionais se necessário
                                message={{ title: alert.title, body: alert.body }}
                            />
                        ))}
                    </div>
                  </div>
                  <div className="card-body">
                    <form>
                      <div className="mb-4">
                        <button type="button" onClick={gerarIndividual} className="btn btn-primary me-2"> Gerar Individual</button>
                        <button type="button" onClick={gerarNovoLote} className="btn btn-primary me-2"> Gerar Novo Lote</button>
                        <button type="button" className="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#personalizar"> Personalizar</button>
                        <button type="button" className="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#pesquisar"> Pesquisar</button>
                      </div>                                       
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="modals">
              <ModalForm 
                  className="modal-dialog-centered modal-lg" 
                  id="personalizar"
                  title="Personalizar"
                  body={
                      <div>
                          
                      </div>
                  }
                  footer={                                    
                          <div className="mb-4">
                              <button type="submit" className="btn btn-primary me-2"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-save align-middle me-2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg></span> Salvar</button>
                              <button type="reset" className="btn btn-primary me-2"><i className="align-middle me-2 fas fa-fw fa-brush"></i> Limpar</button>
                          </div> 
                  }
                  //onSubmit={}
              />
              <ModalForm 
                  className="modal-dialog-centered modal-lg" 
                  id="pesquisar"
                  title="Pesquisar Cartão"
                  body={
                      <div>
                          <div className="response">
                              {alertsCartoes.map(alert => (
                                  <Alert
                                      key={alert.id}
                                      className={alert.type}
                                      message={{ title: alert.title, body: alert.body }}
                                  />
                              ))}
                          </div>
                          <div className="mb-4">
                            <label className="form-label">Codigo</label>
                            <input type="text" id="nome_cartao" name="nome" required disabled onChange={(e) => setNome(e.target.value)} value={nome} className="form-control" placeholder="Codigo"/>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-4">
                                <label className="form-label">Cliente</label>
                                <select className="form-select" value={selectedCliente} onChange={(e) => setSelectedCliente(e.target.value)}>
                                    <option value='none'>Cliente</option>
                                    {clientes.map((cliente) => (
                                        <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                                    ))}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="mb-4">
                            <button type="submit" className="btn btn-primary me-2"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-square align-middle me-2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg></span> Atualizar</button>
                            <button type="reset" className="btn btn-primary me-2"><i className="align-middle me-2 fas fa-fw fa-brush"></i> Limpar</button>
                          </div>
                      </div>    
                  }
                  footer={<Table headers={[{ label: 'Cartao', key: 'id' },{ label: 'Cliente', key: 'cliente_nome' },{ label: 'Ações', key: 'actions' }]} data={cartoes} actions={[{ icon: 'edit-2', func: (cartao) => editCartao(cartao) },{ icon: 'trash', func: (cartao) => deleteCartao(cartao.id) }]} />}
                  onSubmit={createCartao}
              />
            </div>
          </div>
  );
}

export default Cartoes;
