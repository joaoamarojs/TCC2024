import NavSideBar from "../components/NavSideBar";
import NavTopBar from "../components/NavTopBar";
import useUserData from '../hooks/useUserData';
import '../styles/Admin.css';
import { useEffect } from "react";


function Home(){
    const { user, loading, error } = useUserData();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const [users, setUsers] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        api
            .get("/api/user/")
            .then((res) => res.data)
            .then((data) => {
                setUsers(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const deleteUser = (id) => {
        api
            .delete(`/api/user/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Usuario deletado!");
                else alert("Falhou em deletar usuario.");
                getNotes();
            })
            .catch((error) => alert(error));
    };

    const createUser = (e) => {
        e.preventDefault();
        api
            .post("/api/user/register/", { content, title })
            .then((res) => {
                if (res.status === 201) alert("Usuario criado!");
                else alert("Falhou em criar usuario.");
                getUsers();
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
                                    <h3>Usuarios</h3>
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
                                                    <label className="form-label">Usuario</label>
                                                    <input type="text" className="form-control" placeholder="Usuario" />
                                                </div>
                                                <div className="mb-4">
                                                    <label className="form-label">Password</label>
                                                    <input type="password" className="form-control" placeholder="Password" />
                                                </div>
                                                <div className="mb-4">
                                                    <label className="form-label">Tipo Usuario</label>
                                                    <select className="form-select">
                                                        <option>Administrativo</option>
                                                        <option>Barraca</option>
                                                        <option>Caixa</option>
                                                    </select>
                                                </div>
                                                <div className="form-check form-switch mb-4">
                                                    <input className="form-check-input" type="checkbox"/>
                                                    <label className="form-check-label">Ativo</label>
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

export default Home