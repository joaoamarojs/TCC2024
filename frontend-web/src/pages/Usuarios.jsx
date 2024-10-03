import { useState, useEffect } from "react";
import Alert from "../components/Alert";
import Table from '../components/Table';
import api from "../api";

function Usuarios() {

  const [alerts, setAlerts] = useState([]);
  const [users, setUsers] = useState([]);
  const [first_name, setFirst_Name] = useState("");
  const [last_name, setLast_Name] = useState("")
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

  const addAlert = (alert) => {
      setAlerts(prevAlerts => [
          ...prevAlerts,
          { 
              id: Date.now(), 
              ...alert 
          }
      ]);
  };

  const getUsers = () => {
    api.get("/api/user/")
      .then((res) => res.data)
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => addAlert({
          type: 'alert-danger',
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
      .catch((error) => addAlert({
          type: 'alert-danger',
          title: 'Erro!',
          body: error
        }));
  };

  const deleteUser = (id) => {
    api.delete(`/api/user/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) addAlert({type: 'alert-success', title: 'Sucesso!', body: 'Usuario deletado com sucesso.'});
        getUsers();
      })
      .catch((error) => addAlert({
          type: 'alert-danger',
          title: 'Erro!',
          body: 'Falhou em deletar usuário.'+error
        }));
  };

  const createUser = (e) => {
    e.preventDefault();
    const endpoint = selectedUserId ? `/api/user/${selectedUserId}/` : "/api/user/";
    const method = selectedUserId ? 'put' : 'post';
    if(selectedGroup !== 'none'){
      api[method](endpoint, { username, password, first_name, last_name, is_active, groups: [selectedGroup] })
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            addAlert({
              type: 'alert-success',
              title: 'Sucesso!',
              body: 'Usuario salvo com sucesso.'
            });
            setSelectedUserId(null);
            setFirst_Name("");
            setLast_Name("");
            setUsername("");
            setPassword("");
            setIsActive(false);
            setSelectedGroup('none');
          }else{
            addAlert({
              type: 'alert-danger',
              title: 'Erro!',
              body: 'Falhou em salvar usuário.'+res.statusText
            })
          }
          getUsers();
        })
        .catch((error) => alert(error));
    }else{
      addAlert({
        type: 'alert-warning',
        title: 'Atenção!',
        body: 'Selecione um Tipo de Usuario.'
      });
    }
  };

  const clearForm = () => {
    setSelectedUserId(null);
    setFirst_Name("");
    setLast_Name("");
    setUsername("");
    setPassword("");
    setIsActive(false);
    setSelectedGroup('none');
  }

  const editUser = (user) => {
    setSelectedUserId(user.id);
    setFirst_Name(user.first_name);
    setLast_Name(user.last_name);
    setUsername(user.username);
    setPassword("");
    setIsActive(user.is_active);
    setSelectedGroup(user.groups[0] ? user.groups[0] :'none');
  };

  const headers = [
    { label: 'Nome', key: 'first_name' },
    { label: 'Sobrenome', key: 'last_name' },
    { label: 'Usuario', key: 'username' },
    { label: 'Tipo', key: 'group_name' },
    { label: 'Ações', key: 'actions' }
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
              <div className="col-12 col-xl-6">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title">Informações</h5>
                    <hr />
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
                    <form onSubmit={createUser}>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-4">
                            <label className="form-label">Nome</label>
                            <input type="text" id="first_name" name="first_name" required onChange={(e) => setFirst_Name(e.target.value)} value={first_name} className="form-control" placeholder="Nome"/>
                          </div>
                        </div>
                        <div className="col-md-6">                          
                          <div className="mb-4">
                            <label className="form-label">Sobrenome</label>
                            <input type="text" id="last_name" name="last_name" required onChange={(e) => setLast_Name(e.target.value)} value={last_name} className="form-control" placeholder="Sobrenome"/>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-4">
                            <label className="form-label">Usuario</label>
                            <input type="text" id="username" name="username" required onChange={(e) => setUsername(e.target.value)} value={username} className="form-control" placeholder="Usuario"/>
                          </div>
                        </div>
                        <div className="col-md-6">                          
                          <div className="mb-4">
                            <label className="form-label">Password</label>
                            <input type="password" id="password" name="password" required onChange={(e) => setPassword(e.target.value)} value={password} className="form-control" placeholder="Senha"/>
                          </div>
                        </div>
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
                          <i className="align-middle me-2 fas fa-fw fa-save"></i>
                          {selectedUserId ? "Atualizar" : "Salvar"}
                        </button>
                        <button type="button" className="btn btn-primary me-2" onClick={clearForm}><i className="align-middle me-2 fas fa-fw fa-brush"></i> Limpar</button>
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
