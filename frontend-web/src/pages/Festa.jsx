import { useState, useEffect, useRef, cloneElement } from "react";
import Alert from "../components/Alert";
import Modal from '../components/Modal';
import Table from '../components/Table';
import api from "../api";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function Festa(){

    const [formData, setFormData] = useState({
        nome: '',
        data_inicio: '',
    });
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {

    }, []);
    
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

    const handleSubmitFesta = async () => {
        try {
            await api.post('/api/festa/', formData);
            addAlert({ type: 'alert-success', title: 'Sucesso!', body:  'Festa iniciada com sucesso!' });

            const modal = document.getElementById('iniciarFesta');
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao iniciar a festa.';
            addAlert({ type: 'alert-danger', title: 'Erro!', body: errorMessage });

            const modal = document.getElementById('iniciarFesta');
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
        }
    };


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
                const errorMessage = error.response?.data?.message || "Ocorreu um erro desconhecido.";
                Swal.showValidationMessage(`Erro: ${errorMessage}`);
                return false;
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire("Finalizado!", "O evento foi finalizado com sucesso.", "success");
        } else if (result.isDenied) {
            Swal.fire("O evento não foi finalizado.", "", "info");
        }
    });
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
                                            className={alert.type} // Adicione classes adicionais se necessário
                                            message={{ title: alert.title, body: alert.body }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="card-body">
                                <form>
                                    <div className="mb-4">
                                        <button type="button" className="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#iniciarFesta">Iniciar Nova Festa</button>
                                        <button type="button" onClick={finalizarFesta} className="btn btn-primary me-2">Finalizar Festa</button>
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
                            id="iniciarFesta"
                            title="Iniciar Nova Festa"
                            body={
                               <div>
                                    <div className="mb-4">
                                        <label className="form-label">Nome</label>
                                        <input
                                            type="text"
                                            id="nome"
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
                                        <button type="submit" className="btn btn-primary me-2" onClick={handleSubmitFesta}>Salvar</button>
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

export default Festa;
