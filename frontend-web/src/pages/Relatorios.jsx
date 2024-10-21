import { useState, useEffect } from "react";
import ModalForm from '../components/ModalForm';
import Alert from "../components/Alert";
import Table from '../components/Table';
import api from "../api";

function Relatorios() {

  const [isLoading, setIsLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [festas, setFestas] = useState([]);
  const [festa, setFesta] = useState('');
  const [caixas, setCaixas] = useState([]);
  const [barracas, setBarracas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const getFestas = async () => {
      try {
          const response = await api.get("/api/festa/");
          setFestas(response.data);
          setError(null);
      } catch (err) {
          setError(err.response.data.message || "Ocorreu um erro ao buscar festas.");
          setFestas(null);
      }
    };
    getFestas();
  },[]);  

  useEffect(() => {
    console.log(festa)
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
                          <button type="button" className="btn btn-primary me-2 mt-2"><i className="align-middle me-2 fas fa-fw fa-briefcase"></i> Fechamento de Festa</button>
                        </div>                                       
                    </form>
                  </div>
                </div>
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
                                      <option key={caixa.user_caixa} value={caixa.user_caixa}>{caixa.user_caixa_username}</option>
                                  ))}
                              </select>
                          </div>
                      </div>
                  }
                  footer={                                    
                          <div className="mb-4">
                              <button type="button" className="btn btn-primary me-2"><i className="align-middle me-2 fas fa-fw fa-receipt"></i> Gerar Relatorio</button>
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
                                    <option key={barraca.barraca__id} value={barraca.barraca__id}>{barraca.barraca__nome}</option>
                                ))}
                            </select>
                        </div>
                      </div>
                  }
                  footer={                                    
                          <div className="mb-4">
                              <button type="button" className="btn btn-primary me-2"><i className="align-middle me-2 fas fa-fw fa-receipt"></i> Gerar Relatorio</button>
                              <button type="reset" className="btn btn-primary me-2"><i className="align-middle me-2 fas fa-fw fa-brush"></i> Limpar</button>
                          </div> 
                  }
              />
            </div>
          </div>
  );
}

export default Relatorios;
