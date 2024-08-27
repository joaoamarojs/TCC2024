import { useState, useEffect } from "react";
import Alert from "../components/Alert";
import Modal from '../components/Modal';
import Table from '../components/Table';
import api from "../api";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function Evento(){

    const [alert, setAlert] = useState(null);
    const [inputValue, setInputValue] = useState('')

    useEffect(() => {

    }, []);

    const handleCloseAlert = () => {
        setAlert(null);
    };

    const finalizarEvento = () => {
        withReactContent(Swal).fire({
            title: "Você quer mesmo finalizar o evento atual?",
            showDenyButton: true,
            confirmButtonText: "Sim",
            denyButtonText: `Não`
            }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Finalizado!", "", "success");
            } else if (result.isDenied) {
                Swal.fire("O evento não foi finalizado.", "", "info");
            }
        });
    }

    return (
            <div className="container-fluid p-0">
                <div className="row mb-2 mb-xl-3">
                    <div className="col-auto d-none d-sm-block">
                        <h3>Gerenciar Evento</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
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
                                <form>
                                    <div className="mb-4">
                                        <button type="button" className="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#iniciarEvento">Iniciar Novo Evento</button>
                                        <button type="button" onClick={finalizarEvento} className="btn btn-primary me-2">Finalizar Evento</button>
                                        <button type="button" className="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#atribuirBarracas">Atribuir Barracas</button>
                                        <button type="button" className="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#atribuirCaixas">Atribuir Caixas</button>
                                    </div>                                       
                                </form>
                            </div>
                        </div>    
                    </div>
                    <div className="modals">
                        <Modal 
                            className="modal-dialog-centered modal-lg" 
                            id="iniciarEvento"
                            title="Iniciar Novo Evento"
                            body={
                                <div>
                                    <div className="mb-4">
                                        <label className="form-label">Nome</label>
                                        <input type="text" id="nome" name="nome" required className="form-control" placeholder="Nome" />
                                    </div>
                                    <div className="row">
                                        <div className="mb-4 col-md-6">
                                            <label className="form-label">Data inicio</label>
                                            <input type="date" id="data_inicio" name="data_inicio" required className="form-control" />
                                        </div>
                                        <div className="mb-4 col-md-6">
                                            <label className="form-label">Data final</label>
                                            <input type="date" id="data_final" name="data_final" required className="form-control" />
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
                        />
                        <Modal 
                            className="modal-dialog-centered modal-lg" 
                            id="atribuirBarracas"
                            title="Atribuir Barracas"
                            body={
                                <div>
                                    <div className="mb-4">
                                        <label className="form-label">Barracas</label>
                                        <select className="form-select">
                                            <option value='none'>Barracas</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <button type="submit" className="btn btn-primary me-2">Adicionar</button>
                                    </div>
                                </div>    
                            }
                            footer={<Table headers={[{ label: 'Nome', key: 'nome' },{ label: 'Actions', key: 'actions' }]} data={[]} actions={[{ icon: 'trash', func: '' }]} />}
                        />
                        <Modal 
                            className="modal-dialog-centered modal-lg" 
                            id="atribuirCaixas"
                            title="Atribuir Caixas"
                            body={
                                <div>
                                    <div className="mb-4">
                                        <label className="form-label">Caixas</label>
                                        <select className="form-select">
                                            <option value='none'>Caixas</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <button type="submit" className="btn btn-primary me-2">Adicionar</button>
                                    </div>
                                </div>
                            }
                            footer={<Table headers={[{ label: 'Nome', key: 'nome' },{ label: 'Actions', key: 'actions' }]} data={[]} actions={[{ icon: 'trash', func: '' }]} />}
                        />
                    </div>
                </div>
            </div>
    );
}

export default Evento;
