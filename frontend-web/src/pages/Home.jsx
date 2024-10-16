import { useState, useEffect } from "react";
import api from "../api";
import formatDate from "../formatDate";
import '../styles/Admin.css';

function Home(){

    const [festa, setFesta] = useState(null);
    const [festaInfo, setFestaInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getFestaInfo = async () => {
            try {
                const response = await api.get("/api/festa-atual/info/");
                if(response.data){
                    setFestaInfo(response.data);
                    setError(null);
                }else{
                    setError(response.data.message);
                    setFestaInfo(null);
                }
            } catch (err) {
                setError(err.response.data.message || "Ocorreu um erro ao buscar as informações da festa.");
                setFestaInfo(null);
            }
        };
        const getFesta = async () => {
            try {
                const response = await api.get("/api/festa-atual/");
                if(response.data.id){
                    setFesta(response.data);
                    setError(null);
                    getFestaInfo();
                }else{
                    setError(response.data.message);
                    setFesta(null);
                }
            } catch (err) {
                setError(err.response.data.message || "Ocorreu um erro ao buscar a festa.");
                setFesta(null);
            }
        };
        getFesta();
    }, []);

    useEffect(() => {
        const getGraficos = () => {
            new Chart(document.getElementById("chartjs-bar"), {
                type: "bar",
                data: {
                    labels: festaInfo.produtos,
                    datasets: [{
                        label: "Festa Atual",
                        backgroundColor: window.theme.primary,
                        borderColor: window.theme.primary,
                        hoverBackgroundColor: window.theme.primary,
                        hoverBorderColor: window.theme.primary,
                        data: festaInfo.qtd_vendida_atual,
                        barPercentage: .75,
                        categoryPercentage: .5
                    },
                    {
                        label: "Festa Anterior",
                        backgroundColor: "#dee2e6",
                        borderColor: "#dee2e6",
                        hoverBackgroundColor: "#dee2e6",
                        hoverBorderColor: "#dee2e6",
                        data: festaInfo.qtd_vendida_anterior,
                        barPercentage: .75,
                        categoryPercentage: .5
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            gridLines: {
                                display: false
                            },
                            stacked: false,
                            ticks: {
                                stepSize: 20
                            }
                        }],
                        xAxes: [{
                            stacked: false,
                            gridLines: {
                                color: "transparent"
                            }
                        }]
                    }
                }
            });
            new Chart(document.getElementById("chartjs-dashboard-pie"), {
                type: "pie",
                data: {
                    labels: festaInfo.nomes_barracas,
                    datasets: [{
                        data: festaInfo.total_vendas_barracas,
                        backgroundColor: [
							window.theme.primary,
							window.theme.success,
							window.theme.danger,
							window.theme.warning,
							window.theme.info,
                            "#E8EAED"
                        ],
                        borderWidth: 5,
                        borderColor: window.theme.white
                    }]
                },
                options: {
                    responsive: !window.MSInputMethodContext,
                    maintainAspectRatio: false,
                    cutoutPercentage: 70
                }
            });
        }
        if (festa) {
            getGraficos();
        }
    }, [festaInfo]);

    const formatarValor = (valor) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    };

    return <div className="container-fluid p-0">
                <div className="row mb-2 mb-xl-3">
                    <div className="col-auto d-none d-sm-block">
                        <h3>Dashboard</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-6 col-xxl-5 d-flex">
                        <div className="w-100">
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col mt-0">
                                                    <h5 className="card-title">Festa Atual</h5>
                                                </div>

                                                <div className="col-auto">
                                                    <div className="stat text-primary"><i className="align-middle far fa-fw fa-gem"></i></div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col mt-1">
                                                    {error ? (
                                                        <span className="text-muted">{error}</span>
                                                    ) : festa ? (
                                                        <>
                                                            <div className="mb-0">
                                                                <span className="text-muted">Nome: {festa.nome}</span>
                                                            </div>
                                                            <div className="mb-0">
                                                                <span className="text-muted">Data de Início: {formatDate(festa.data_inicio)}</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <span className="text-muted">Carregando...</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>                                        
                                    </div>
                                    {festaInfo ? (
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col mt-0">
                                                    <h5 className="card-title">Cartões Ativos</h5>
                                                </div>
                                                <div className="col-auto">
                                                    <div className="stat text-primary"><i className="align-middle far fa-fw fa-credit-card"></i></div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col mt-1">
                                                    <h4 className="mt-1 mb-3">{festaInfo.cartoes_ativos}</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>) : (<></>)
                                    }
                                </div>
                                {festaInfo ? (
                                <div className="col-sm-6">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col mt-0">
                                                    <h5 className="card-title">Barracas Ativas</h5>
                                                </div>

                                                <div className="col-auto">
                                                    <div className="stat text-primary"><i className="align-middle fas fa-fw fa-store"></i></div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col mt-1">
                                                    <h4 className="mt-1 mb-3">{festaInfo.barracas_ativas}</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col mt-0">
                                                    <h5 className="card-title">Caixas Ativos</h5>
                                                </div>

                                                <div className="col-auto">
                                                    <div className="stat text-primary"><i className="align-middle fas fa-fw fa-money-check-alt"></i></div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col mt-1">
                                                    <h4 className="mt-1 mb-3">{festaInfo.caixas_ativas}</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>) : (<></>)
                                    }
                            </div>
                        </div>
                    </div>
                    {festaInfo ? (
                    <div className="col-xl-6 col-xxl-7">
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="card-title">Produtos em Relação a ultima festa.</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="chart">
                                            <canvas id="chartjs-bar"></canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="card-title">Movimentação Parcial das Barracas</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="align-self-center w-100">
                                            <div className="py-3">
                                                <div className="chart chart-xs">
                                                    <canvas id="chartjs-dashboard-pie"></canvas>
                                                </div>
                                            </div>
                                            <div className="table-responsive">
                                                <table className="table mb-0">
                                                    <tbody style={{ maxHeight: '200px', overflowY: festaInfo.nomes_barracas.length > 4 ? 'scroll' : 'auto', display: 'block' }}>
                                                    {festaInfo.nomes_barracas.map((barraca, index) => (
                                                        <tr key={index}>
                                                            <td>{barraca}</td>
                                                            <td className="text-end">{formatarValor(festaInfo.total_vendas_barracas[index])}</td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                    <tfoot>
                                                    <tr>
                                                        <td><strong>Total Geral</strong></td>
                                                        <td className="text-end"><strong>{formatarValor(festaInfo.total_vendas_barracas.reduce((acc, venda) => acc + venda, 0))}</strong></td>
                                                    </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>) : (<></>)
                    }
                </div>
            </div>
}

export default Home