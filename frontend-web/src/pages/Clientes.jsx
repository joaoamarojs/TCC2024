import NavSideBar from "../components/NavSideBar";
import NavTopBar from "../components/NavTopBar";
import useUserData from '../hooks/useUserData';
import '../styles/Admin.css';
import '/src/assets/app.js';

function Clientes(){
    const { user, loading, error } = useUserData();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const [clients, setClients] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        getClients();
    }, []);

    const getClients = () => {
        api
            .get("/api/cliente/")
            .then((res) => res.data)
            .then((data) => {
                setClients(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const deleteClient = (id) => {
        api
            .delete(`/api/cliente/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Cliente deletado!");
                else alert("Falhou em deletar cliente.");
                getClients();
            })
            .catch((error) => alert(error));
    };

    const createClient = (e) => {
        e.preventDefault();
        api
            .post("/api/cliente/", { content, title })
            .then((res) => {
                if (res.status === 201) alert("Cliente cadastrado!");
                else alert("Falhou em cadastrar cliente.");
                getClients();
            })
            .catch((err) => alert(err));
    };

    return <div className="wrapper">
                <NavSideBar name={user.username}/>
                <div className="main">
                    <NavTopBar />
                    <main className="content">
                        <div className="container-fluid p-0">
                            <div className="row mb-2 mb-xl-3">
                                <div className="col-auto d-none d-sm-block">
                                    <h3>Clientes</h3>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5 className="card-title">Informações</h5>
                                            <hr/>
                                        </div>
                                        <div className="card-body">
                                            <form>
                                                <div className="mb-4">
                                                    <label className="form-label">Nome</label>
                                                    <input type="text" className="form-control" placeholder="Nome" />
                                                </div>
                                                <div className="mb-4">
                                                    <label className="form-label">CPF</label>
                                                    <input type="password" className="form-control" placeholder="Cpf" />
                                                </div>
                                                <div className="mb-4">
                                                    <label className="form-label">Data Nascimento</label>
                                                    <input type="date" className="form-control" />
                                                </div>
                                                <div className="form-check form-switch mb-4">
                                                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckChecked"/>
                                                    <label className="form-check-label" for="flexSwitchCheckChecked">Ativo</label>
                                                </div>
                                                <div className="mb-4">
                                                    <button type="submit" className="btn btn-primary me-2">Salvar</button>
                                                    <button type="button" className="btn btn-primary">Excluir</button>
                                                </div>                                       
                                            </form>
                                        </div>
                                    </div>    
                                </div>
                            </div>
                        </div>
                    </main>    
                </div>
            </div>;
}

export default Clientes