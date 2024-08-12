import React, { useState, useEffect } from "react";
import NavSideBar from "../components/NavSideBar";
import NavTopBar from "../components/NavTopBar";
import Table from '../components/Table';
import api from "../api";

function Usuarios(props) {
  const { user, loading, error } = props;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    api.get("/api/user/")
      .then((res) => res.data)
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => alert(err));
  };

  const deleteUser = (id) => {
    api.delete(`/api/user/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Usuario deletado!");
        else alert("Falhou em deletar usuario.");
        getUsers();
      })
      .catch((error) => alert(error));
  };

  const createUser = (e) => {
    e.preventDefault();
    const endpoint = selectedUserId ? `/api/user/${selectedUserId}/` : "/api/user/register/";
    const method = selectedUserId ? 'put' : 'post';

    api[method](endpoint, { username, password })
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          alert("Usuário salvo com sucesso!");
          setSelectedUserId(null);
          setUsername("");
          setPassword("");
        } else {
          alert("Falhou em salvar usuário.");
        }
        getUsers();
      })
      .catch((err) => alert(err));
  };

  const editUser = (user) => {
    setSelectedUserId(user.id);  // Supondo que o objeto user tenha um campo 'id'
    setUsername(user.username);
    setPassword("");  // Ou mantenha a senha atual, dependendo da lógica do backend
  };

  const headers = [
    { label: 'Usuario', key: 'username' },
    { label: 'Actions', key: 'actions' }
  ];

  const actions = [
    { icon: 'edit-2', func: (user) => editUser(user) },
    { icon: 'trash', func: (user) => deleteUser(user.id) }
  ];

  return (
    <div className="wrapper">
      <NavSideBar name={user.username} />
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
                    <hr />
                  </div>
                  <div className="card-body">
                    <form onSubmit={createUser}>
                      <div className="mb-4">
                        <label className="form-label">Usuario</label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          required
                          onChange={(e) => setUsername(e.target.value)}
                          value={username}
                          className="form-control"
                          placeholder="Usuario"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Password</label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          required
                          onChange={(e) => setPassword(e.target.value)}
                          value={password}
                          className="form-control"
                          placeholder="Senha"
                        />
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
                        <input className="form-check-input" type="checkbox" />
                        <label className="form-check-label">Ativo</label>
                      </div>
                      <div className="mb-4">
                        <button type="submit" className="btn btn-primary me-2">
                          {selectedUserId ? "Atualizar" : "Salvar"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-xl-6">
                <div className="card">
                  <Table headers={headers} data={users} actions={actions} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Usuarios;
