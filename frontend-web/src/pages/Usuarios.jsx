import React, { useState, useEffect } from "react";
import NavSideBar from "../components/NavSideBar";
import NavTopBar from "../components/NavTopBar";
import Alert from "../components/Alert";
import Table from '../components/Table';
import api from "../api";

function Usuarios(props) {
  const { user } = props;

  const [alert, setAlert] = useState(null);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [is_active, setIsActive] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('none');

  useEffect(() => {
    getUsers();
    getGroups();
    return () => {};
  }, []);

  const getUsers = () => {
    api.get("/api/user/")
      .then((res) => res.data)
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => setAlert({
          type: 'alert-error',
          title: 'Erro!',
          body: error
        }));
  };

  const getGroups = () => {
    api.get("/api/groups/")
      .then((res) => res.data)
      .then((data) => {
        setGroups(data);
      })
      .catch((error) => setAlert({
          type: 'alert-error',
          title: 'Erro!',
          body: error
        }));
  };

  const deleteUser = (id) => {
    api.delete(`/api/user/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) setAlert({type: 'alert-success', title: 'Sucesso!', body: 'Usuario deletado com sucesso.'});
        getUsers();
      })
      .catch((error) => setAlert({
          type: 'alert-error',
          title: 'Erro!',
          body: 'Falhou em deletar usuário.'+error
        }));
  };

  const createUser = (e) => {
    e.preventDefault();
    const endpoint = selectedUserId ? `/api/user/${selectedUserId}/` : "/api/user/register/";
    const method = selectedUserId ? 'put' : 'post';
    if(selectedGroup !== 'none'){
      api[method](endpoint, { username, password, is_active, groups: [selectedGroup] })
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            setAlert({
              type: 'alert-success',
              title: 'Sucesso!',
              body: 'Usuario salvo com sucesso.'
            });
            setSelectedUserId(null);
            setUsername("");
            setPassword("");
            setIsActive(false);
            setSelectedGroup('none');
          }else{
            setAlert({
              type: 'alert-error',
              title: 'Erro!',
              body: 'Falhou em salvar usuário.'+res.statusText
            })
          }
          getUsers();
        })
        .catch((error) => alert(error));
    }else{
      setAlert({
        type: 'alert-info',
        title: 'Atenção!',
        body: 'Selecione um Tipo de Usuario.'
      });
    }
  };

  const clearForm = () => {
    setSelectedUserId(null);
    setUsername("");
    setPassword("");
    setIsActive(false);
    setSelectedGroup('none');
  }

  // Função para fechar o alerta
  const handleCloseAlert = () => {
    setAlert(null);
  };

  const editUser = (user) => {
    setSelectedUserId(user.id);
    setUsername(user.username);
    setPassword("");
    setIsActive(user.is_active);
    setSelectedGroup(user.groups[0] ? user.groups[0] :'none');
  };

  const headers = [
    { label: 'Usuario', key: 'username' },
    { label: 'Tipo', key: 'group_name' },
    { label: 'Actions', key: 'actions' }
  ];

  const actions = [
    { icon: 'edit-2', func: (user) => editUser(user) },
    { icon: 'trash', func: (user) => deleteUser(user.id) }
  ];

  return (
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
                    <form onSubmit={createUser}>
                      <div className="mb-4">
                        <label className="form-label">Usuario</label>
                        <input type="text" id="username" name="username" required onChange={(e) => setUsername(e.target.value)} value={username} className="form-control" placeholder="Usuario"/>
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Password</label>
                        <input type="password" id="password" name="password" required onChange={(e) => setPassword(e.target.value)} value={password} className="form-control" placeholder="Senha"/>
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Tipo Usuario</label>
                        <select className="form-select" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                            <option value='none'>Tipo_Usuario</option>
                            {groups.map((group) => (
                                <option key={group.id} value={group.id}>{group.name}</option>
                            ))}
                        </select>
                      </div>
                      <div className="form-check form-switch mb-4">
                        <input className="form-check-input" type="checkbox" checked={is_active} onChange={() => setIsActive(!is_active)}/>
                        <label className="form-check-label">Ativo</label>
                      </div>
                      <div className="mb-4">
                        <button type="submit" className="btn btn-primary me-2">
                          {selectedUserId ? "Atualizar" : "Salvar"}
                        </button>
                        <button type="button" className="btn btn-primary me-2" onClick={clearForm}>Limpar</button>
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
  );
}

export default Usuarios;
