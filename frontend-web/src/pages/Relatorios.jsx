import { useState, useEffect } from "react";
import ModalForm from '../components/ModalForm';
import Alert from "../components/Alert";
import { PDFDownloadLink } from '@react-pdf/renderer';
import PdfReport  from '../components/PdfReport';
import api from "../api";

function Relatorios() {

  const [isLoading, setIsLoading] = useState(false);
  const [selectedCaixa, setSelectedCaixa] = useState(null);
  const [selectedBarraca, setSelectedBarraca] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [festas, setFestas] = useState([]);
  const [festa, setFesta] = useState('');
  const [caixas, setCaixas] = useState([]);
  const [barracas, setBarracas] = useState([]);
  const [pdfData, setPdfData] = useState(null);
  const [pdfNome, setPdfNome] = useState('');

  useEffect(() => {
    const getFestas = async () => {
      try {
          const response = await api.get("/api/festa/");
          setFestas(response.data);
      } catch (err) {
          addAlert({
                      type: 'alert-danger',
                      title: 'Erro!',
                      body: err.response.data.message || "Ocorreu um erro ao buscar festas."
                  });
          setFestas(null);
      }
    };
    getFestas();
  },[]);  

  useEffect(() => {
    const getCaixas = async () => {
      try {
          const response = await api.get(`/api/caixa_festa/?relatorio=true&festa=${festa}`);
          setCaixas(response.data);
      } catch (err) {
          console.error(err);
      }
    };
    const getBarracas = async () => {
      try {
          const response = await api.get(`/api/barraca_festa/?relatorio=true&festa=${festa}`);
          setBarracas(response.data);
      } catch (err) {
          console.error(err);
      }
    };
    if(festa){
      getCaixas();
      getBarracas();
    }
  }, [festa]);

  const addAlert = (alert) => {
      setAlerts(prevAlerts => [
          ...prevAlerts,
          { 
              id: Date.now(), 
              ...alert 
          }
      ]);
  };

  const getBarraca_Fechamento = async () => {
    try {
      const response = await api.get(`/api/barraca_fechamento/${selectedBarraca}/`);
      generateBarraca_FechamentoReport(response.data);
      setPdfNome(`Fechamento_Barraca - ${response.data.nome_barraca}`)
    } catch (err) {
      addAlert({
            type: 'alert-danger',
            title: 'Erro!',
            body: err.response.data.message || "Ocorreu um erro ao gerar relatorio."
      });
    }
  };

  const generateBarraca_FechamentoReport = (data) => {
    const headerContent = `Fechamento de Barraca - ${data.nome_barraca}`;
    const bodyContent = [
      `Festa: ${data.festa}`,
      `Quantidade por Produto:`,
      ...data.qtd_por_produto.map(item => ` - ${item.produto__nome}:${item.total}`),
      `Total de Vendas: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.total_vendas)}`,
    ];
    const footerContent = 'Relatório gerado em: ' + new Date().toLocaleDateString();

    setPdfData({ headerContent, bodyContent, footerContent });
    const modal = document.getElementById('fecharBarraca');
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    addAlert({
      type: 'alert-success',
      title: 'Sucesso!',
      body: "Relatorio gerado com sucesso."
    });
  };

  const getCaixa_Fechamento = async () => {
    try {
      const response = await api.get(`/api/caixa_fechamento/${selectedCaixa}/`);
      generateCaixa_FechamentoReport(response.data);
      setPdfNome(`Fechamento_Caixa - ${response.data.nome_caixa}`)
    } catch (err) {
      addAlert({
            type: 'alert-danger',
            title: 'Erro!',
            body: err.response.data.message || "Ocorreu um erro ao gerar relatorio."
      });
    }
  };

  const generateCaixa_FechamentoReport = (data) => {
    const headerContent = `Fechamento de Caixa - ${data.nome_caixa}`;
    const bodyContent = [
      `Festa: ${data.festa}`,
      `Troco Inicial: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.troco_inicial)}`,
      `Total por Pagamento:`,
      ...data.total_por_pagamento.map(item => ` - ${item.forma_pagamento}: R$ ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total)}`),
      `Diferença de Troco: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.diferenca_troco)}`,
      `Total Geral de Vendas: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.total_geral_vendas)}`,
      `Troco Final: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.troco_final)}`,
    ];
    const footerContent = 'Relatório gerado em: ' + new Date().toLocaleDateString();

    setPdfData({ headerContent, bodyContent, footerContent });
    const modal = document.getElementById('fecharCaixa');
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    addAlert({
      type: 'alert-success',
      title: 'Sucesso!',
      body: "Relatorio gerado com sucesso."
    });
  };

  const getFesta_Fechamento = async (tipo) => {
    try {
      const response = await api.get(`/api/festa_fechamento/${festa}/`);
      switch (tipo) {
        case 'barracas':
          generateFechamentoBarracasReport(response.data)
          setPdfNome(`Fechamento_Barracas - ${response.data.festa}`)
          break;
        case 'caixas':
          generateFechamentoCaixasReport(response.data)
          setPdfNome(`Fechamento_Caixas - ${response.data.festa}`)
          break;
        default: 
          addAlert({
                type: 'alert-danger',
                title: 'Erro!',
                body: "Relatorio invalido."
          });
      }    
    } catch (err) {
      addAlert({
            type: 'alert-danger',
            title: 'Erro!',
            body: err.response.data.message || "Ocorreu um erro ao gerar relatorio."
      });
    }
  };

  const generateFechamentoBarracasReport = (data) => {
    const headerContent = `Fechamento das Barracas - ${data.festa}`;

    const barracasContent = data.barracas.map(barraca => {
      return [
        `\nBarraca: ${barraca.nome_barraca}`,
        `\nProdutos Vendidos:\n`,
        ...barraca.qtd_por_produto.map(item => ` - ${item.produto__nome}: ${item.total}`),
        `\nTotal de Vendas: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(barraca.total_vendas)}`,
        `\n-----------------------------------`
      ].join('\n');
    }).join('\n');

    const bodyContent = [
      `Festa: ${data.festa}`,
      `\nDetalhes das Barracas:\n`,
      barracasContent,
      `\nResumo Geral:`,
      `Total Barracas: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data["total-barracas"])}`
    ];

    const footerContent = 'Relatório gerado em: ' + new Date().toLocaleDateString();

    setPdfData({ headerContent, bodyContent, footerContent });

    addAlert({
      type: 'alert-success',
      title: 'Sucesso!',
      body: "Relatório de fechamento gerado com sucesso."
    });
  };

  const generateFechamentoCaixasReport = (data) => {
    const headerContent = `Fechamento dos caixas - ${data.festa}`;
    
    const caixasContent = data.caixas.map(caixa => {
      return [
        `\nCaixa: ${caixa.nome_caixa}`,
        `\nTroco Inicial: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(caixa.troco_inicial)}`,
        `\nTroco Final: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(caixa.troco_final)}`,
        `\nDiferença de Troco: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(caixa.diferenca_troco)}`,
        `\nTotal por Pagamento:\n`,
        ...caixa.total_por_pagamento.map(item => ` - ${item.forma_pagamento}: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total)}`),
        `\nTotal Geral de Vendas: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(caixa.total_geral_vendas)}`,
        `\n-----------------------------------`
      ].join('\n');
    }).join('\n');

    const bodyContent = [
      `Festa: ${data.festa}`,
      `\nDetalhes dos Caixas:\n`,
      caixasContent,
      `\nResumo Geral:`,
      `Total Caixas: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data["total-caixas"])}`,
    ];

    const footerContent = 'Relatório gerado em: ' + new Date().toLocaleDateString();

    setPdfData({ headerContent, bodyContent, footerContent });

    addAlert({
      type: 'alert-success',
      title: 'Sucesso!',
      body: "Relatório de fechamento gerado com sucesso."
    });
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
                <h3>Relatorios</h3>
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
                    <form>
                        <div className="mb-4">
                          <label className="form-label">Festas</label>
                          <select className="form-select" required onChange={(e) => setFesta(e.target.value)}>
                              <option value='none'>Selecione uma Festa</option>
                              {festas.map(fest => (
                                  <option key={fest.id} value={fest.id}>{fest.nome}</option>
                              ))}
                          </select>
                        </div>
                        <div className="mb-4">
                          <button type="button" className="btn btn-primary me-2 mt-2" data-bs-toggle="modal" data-bs-target="#fecharCaixa"><i className="align-middle me-2 fas fa-fw fa-money-check-alt"></i> Fechamento de Caixa</button>
                          <button type="button" className="btn btn-primary me-2 mt-2" data-bs-toggle="modal" data-bs-target="#fecharBarraca"><i className="align-middle me-2 fas fa-fw fa-store"></i> Fechamento de Barraca</button>
                          <div className="btn-group me-2 mt-2">
                            <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="align-middle me-2 fas fa-fw fa-briefcase"></i> Fechamento de Festa</button>
                            <div className="dropdown-menu">
                              <a className="dropdown-item" href="#" onClick={() => getFesta_Fechamento('caixas')}>Caixas</a>
                              <div className="dropdown-divider"></div>
                              <a className="dropdown-item" href="#" onClick={() => getFesta_Fechamento('barracas')}>Barracas</a>
                            </div>
                          </div>
                        </div>                                       
                    </form>
                  </div>
                </div>
                {pdfData && (
                  <div className="card">
                    <div className="card-body">
                      <PDFDownloadLink
                        document={<PdfReport headerContent={pdfData.headerContent} bodyContent={pdfData.bodyContent} footerContent={pdfData.footerContent} />}
                        fileName={`${pdfNome}.pdf`}
                      >
                        {({ loading }) => (loading ? 'Gerando PDF...' : `Baixar Relatório "${pdfNome}"`)}
                      </PDFDownloadLink>
                    </div>  
                  </div>  
                )}
              </div>
            </div>
            <div className="modals">
              <ModalForm 
                  className="modal-dialog-centered modal-lg" 
                  id="fecharCaixa"
                  title="Fechamento de Caixa"
                  body={
                      <div>
                          <div className="mb-4">
                              <label className="form-label">Caixas</label>
                              <select className="form-select" required onChange={(e) => setSelectedCaixa(e.target.value)}>
                                  <option value='none'>Selecione um Usuario</option>
                                  {caixas.map(caixa => (
                                      <option key={caixa.id} value={caixa.id}>{caixa.user_caixa__username}</option>
                                  ))}
                              </select>
                          </div>
                      </div>
                  }
                  footer={                                    
                          <div className="mb-4">
                              <button type="button" className="btn btn-primary me-2" onClick={getCaixa_Fechamento}><i className="align-middle me-2 fas fa-fw fa-receipt"></i> Gerar Relatorio</button>
                              <button type="reset" className="btn btn-primary me-2"><i className="align-middle me-2 fas fa-fw fa-brush"></i> Limpar</button>
                          </div> 
                  }
              />
              <ModalForm 
                  className="modal-dialog-centered modal-lg" 
                  id="fecharBarraca"
                  title="Fechamento de Barraca"
                  body={
                      <div>
                        <div className="mb-4">
                            <label className="form-label">Barracas</label>
                            <select className="form-select" required onChange={(e) => setSelectedBarraca(e.target.value)}>
                                <option value='none'>Selecione uma Barraca</option>
                                {barracas.map(barraca => (
                                    <option key={barraca.id} value={barraca.id}>{barraca.barraca__nome}</option>
                                ))}
                            </select>
                        </div>
                      </div>
                  }
                  footer={                                    
                          <div className="mb-4">
                              <button type="button" className="btn btn-primary me-2" onClick={getBarraca_Fechamento}><i className="align-middle me-2 fas fa-fw fa-receipt"></i> Gerar Relatorio</button>
                              <button type="reset" className="btn btn-primary me-2"><i className="align-middle me-2 fas fa-fw fa-brush"></i> Limpar</button>
                          </div> 
                  }
              />
            </div>
          </div>
  );
}

export default Relatorios;
