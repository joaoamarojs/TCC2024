import React, { useState, useEffect } from "react";
import { createRoot } from 'react-dom/client';
import ModalForm from '../components/ModalForm';
import Alert from "../components/Alert";
import Table from '../components/Table';
import api from "../api";
import CartaoFesta from "../components/CartaoFesta";
import QRCode from "react-qr-code";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function Cartoes() {

  const [isLoadingPDF, setIsLoadingPDF] = useState(false);
  const [isLoadingCartao, setIsLoadingCartao] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [alertsCartoes, setAlertsCartoes] = useState([]);
  const [alertsConfigCartao, setAlertsConfigCartao] = useState([]);
  const [cartoes, setCartoes] = useState([]);
  const [configcartao, setConfigCartao] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [fonte, setFonte] = useState("");
  const [cor, setCor] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [cor_cartao, setCorCartao] = useState("");
  const [nome, setNome] = useState("");
  const [selectedCartaoId, setSelectedCartaoId] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState('none');
  const [ativo, setAtivo] = useState(false);

  useEffect(() => {
    getCartoes();
    getClientes();
    getConfigCartao();
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

  const addAlertConfigCartao = (alert) => {
      setAlertsConfigCartao(prevAlerts => [
          ...prevAlerts,
          { 
              id: Date.now(), 
              ...alert 
          }
      ]);
  };

  const getConfigCartao = () => {
    setIsLoadingCartao(true)
    api.get("/api/config_cartao/")
      .then((res) => res.data)
      .then((data) => {
        setConfigCartao(data);
        setTitulo(data.titulo);
        setFonte(data.fonte);
        setCor(data.cor);
        setTamanho(data.tamanho);
        setCorCartao(data.cor_cartao);
        setIsLoadingCartao(false)
      })
      .catch((error) => addAlertCartoes({
          type: 'alert-danger',
          title: 'Erro!',
          body: error
        }));
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

  const updateCartao = (e) => {
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

  const saveConfigCartao = (e) => {
    e.preventDefault();
    api.post(`/api/config_cartao/`, { titulo, fonte, tamanho, cor, cor_cartao })
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            addAlert({
              type: 'alert-success',
              title: 'Sucesso!',
              body: 'Cartão salvo com sucesso.'
            });
          }else{
            addAlert({
              type: 'alert-danger',
              title: 'Erro!',
              body: 'Falhou em salvar cartão.'+res.statusText
            })
          }
          getConfigCartao();
          const modal = document.getElementById('personalizar');
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
        })
        .catch((error) => addAlertConfigCartao({ type: 'alert-danger',title: 'Erro!',body: 'Falhou em salvar cartao. '+error.response.data.message}));
  };

  const createCartao = (quantidade) => {
    api.post(`/api/cartao/`, { quantidade: quantidade })
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            addAlert({
              type: 'alert-success',
              title: 'Sucesso!',
              body: 'Cartões criados com sucesso.'
            });
            generatePdf(res.data.novos_cartoes_ids);
          }else{
            addAlert({
              type: 'alert-danger',
              title: 'Erro!',
              body: 'Falhou em criar cartões.'+res.statusText
            })
          }
          getCartoes();
        })
        .catch((error) => addAlert({ type: 'alert-danger',title: 'Erro!',body: 'Falhou em criar cartões. '+error}));
  };

  const editCartao = (cartao) => {
    setSelectedCartaoId(cartao.id);
    setNome(cartao.id);
    setSelectedCliente(cartao.cliente ? cartao.cliente :'none');
    setAtivo(cartao.ativo);
  };

  const gerarIndividual = () => {createCartao(1);}
  const gerarNovoLote = () => {        
    withReactContent(Swal).fire({
            title: "Quantos Cartões deseja gerar?",
            input: 'number',
            inputLabel: 'Digite a quantidade',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showDenyButton: true,
            confirmButtonText: "Gerar",
            denyButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            preConfirm: async (quantidade) => {
                console.log(quantidade)
                if (!quantidade) {
                    Swal.showValidationMessage('Digite um valor!');
                    return false; 
                }
                
                try {
                    createCartao(parseInt(quantidade, 10));
                } catch (error) {
                    const errorMessage = error.response.data.message || "Ocorreu um erro desconhecido.";
                    Swal.showValidationMessage(`Erro: ${errorMessage}`);
                    return false;
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    };

  const generatePdf = async (codigos) => {
    if (codigos[0]) {
        setIsLoadingPDF(true);
        const pdf = new jsPDF();
        let positionY = 10;
        let positionX = 10;
        const pageHeight = pdf.internal.pageSize.height;

        const hiddenContainer = document.createElement('div');
        hiddenContainer.style.position = 'absolute';
        hiddenContainer.style.left = '-9999px';
        document.body.appendChild(hiddenContainer);

        for (let i = 0; i < codigos.length; i++) {
            const cardContainer = document.createElement('div');
            hiddenContainer.appendChild(cardContainer);

            const root = createRoot(cardContainer);
            const cardElement = (
                <CartaoFesta
                    code={codigos[i]}
                    text={configcartao.titulo}
                    textColor={configcartao.cor}
                    fontSize={configcartao.tamanho}
                    bgColor={configcartao.cor_cartao}
                    fontFamily={configcartao.fonte}
                    svg={<QRCode
                        size={928}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value={`{code: ${codigos[i]}}`}
                        viewBox={`0 0 928 928`}
                    />}
                />
            );

            root.render(cardElement);

            try {
                await new Promise((resolve) => setTimeout(resolve, 100));
                const canvas = await html2canvas(cardContainer);

                if (canvas.width === 0 || canvas.height === 0) {
                    console.error("Canvas não foi gerado corretamente. Dimensões: ", canvas.width, canvas.height);
                    continue;
                }

                const imgData = canvas.toDataURL('image/png');

                if (!imgData) {
                    console.error("Não foi possível gerar os dados PNG do canvas.");
                    continue;
                }

                if (positionY + 50 > pageHeight) {
                    pdf.addPage();
                    positionY = 10;
                }

                pdf.addImage(imgData, 'PNG', positionX, positionY, 90, 50);

                if (positionX > 10) {
                    positionX = 10;
                    positionY += 55;
                } else {
                    positionX = 110;
                }

            } catch (error) {
                console.error('Erro ao gerar o canvas ou o PNG:', error);
            }

            hiddenContainer.removeChild(cardContainer);
        }

        document.body.removeChild(hiddenContainer);

        pdf.output('dataurlnewwindow');
        setIsLoadingPDF(false);
    }
  };

  return (
          <div className="container-fluid p-0">
            {isLoadingPDF && (
                <div className="loading-overlay">
                  <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            <div className="row mb-2 mb-xl-3">
              <div className="col-auto d-none d-sm-block">
                <h3>Cartões</h3>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
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
                    <div className="row">
                    {isLoadingCartao ? (
                        <div style={{ width: "350px", height: "200px", padding: "20px", position: "relative", boxSizing: "border-box", justifyContent: "center", alignItems: "center"}}>
                          <div className="spinner-grow spinner-grow-sm text-dark me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <div className="spinner-grow spinner-grow-sm text-dark me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <div className="spinner-grow spinner-grow-sm text-secondary me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>) :
                          <CartaoFesta
                            bgColor={configcartao.cor_cartao}
                            textColor={configcartao.cor}
                            text={configcartao.titulo}
                            code="1234567"
                            fontSize={configcartao.tamanho}
                            fontFamily={configcartao.fonte}
                          />
                        }
                      <div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
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
            </div>
            <div className="modals">
              <ModalForm 
                  className="modal-dialog-centered modal-lg" 
                  id="personalizar"
                  title="Personalizar"
                  body={
                      <div className="row">
                        <div className="response">
                          {alertsConfigCartao.map(alert => (
                              <Alert
                                  key={alert.id}
                                  className={alert.type}
                                  message={{ title: alert.title, body: alert.body }}
                              />
                          ))}
                        </div>
                        <div className="col-sm-7">
                          <div className="mb-3">
                            <label className="form-label">Titulo</label>
                            <input type="text" className="form-control" id="titulo" name="titulo" onChange={(e) => setTitulo(e.target.value)} value={titulo} placeholder="Titulo"/>
                          </div>
                          <div className="row">
                            <div className="mb-3 col-md-6">
                              <label className="form-label">Fonte</label>
                              <input type="text" className="form-control" id="fonte" name="fonte" onChange={(e) => setFonte(e.target.value)} value={fonte} placeholder="Fonte"/>
                            </div>
                            <div className="mb-3 col-md-4">
                              <label className="form-label">Tamanho</label>
                              <input type="number" className="form-control" id="tamanho" name="tamanho" onChange={(e) => setTamanho(e.target.value)} value={tamanho} placeholder="Tamanho"/>
                            </div>
                            <div className="mb-3 col-md-2">
                              <label className="form-label">Cor</label>
                              <input type="color" className="form-control" id="cor" name="cor" onChange={(e) => setCor(e.target.value)} value={cor} />
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Cor Cartão</label>
                            <input type="color" className="form-control" id="cor_cartao" name="cor_cartao" onChange={(e) => setCorCartao(e.target.value)} value={cor_cartao} />
                          </div>
                        </div>
                        <div className="col-sm-5">
                          <CartaoFesta
                            bgColor={cor_cartao}
                            textColor={cor}
                            text={titulo}
                            code="1234567"
                            fontSize={tamanho}
                            fontFamily={fonte}
                          />
                        </div>                        
                      </div>
                  }
                  footer={                                    
                          <div className="mb-4">
                              <button type="submit" className="btn btn-primary me-2"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-save align-middle me-2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg></span> Salvar</button>
                          </div> 
                  }
                  onSubmit={saveConfigCartao}
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
                              <div className="row">
                                <div className="col-md-12">
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
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="form-check form-switch mb-4">
                                    <input className="form-check-input" type="checkbox" checked={ativo} onChange={() => setAtivo(!ativo)}/>
                                    <label className="form-check-label">Ativo</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-4">
                              <CartaoFesta
                                bgColor={configcartao.cor_cartao}
                                textColor={configcartao.cor}
                                text={configcartao.titulo}
                                code={nome}
                                fontSize={configcartao.tamanho}
                                fontFamily={configcartao.fonte}
                                svg={selectedCartaoId ? <QRCode
                                  size={928}
                                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                  value={`{code: ${nome}}`}
                                  viewBox={`0 0 928 928`}
                                />: ''}
                              />
                              </div>
                            </div>
                          </div>
                          <div className="mb-4">
                            <button type="submit" className="btn btn-primary me-2"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-square align-middle me-2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg></span> Atualizar</button>
                            <button type="reset" className="btn btn-primary me-2"><i className="align-middle me-2 fas fa-fw fa-brush"></i> Limpar</button>
                            <button type="button" className="btn btn-primary me-2" onClick={() => generatePdf([selectedCartaoId])}><i className="align-middle me-2 fas fa-fw fa-print"></i> Imprimir</button>
                          </div>
                      </div>    
                  }
                  footer={<Table headers={[{ label: 'Cartao', key: 'id' },{ label: 'Cliente', key: 'cliente_nome' },{ label: 'Ações', key: 'actions' }]} data={cartoes} actions={[{ icon: 'edit-2', func: (cartao) => editCartao(cartao) },{ icon: 'trash', func: (cartao) => deleteCartao(cartao.id) }]} />}
                  onSubmit={updateCartao}
              />
            </div>
          </div>
  );
}

export default Cartoes;
