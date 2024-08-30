import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN,REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator";
import "../styles/Form.css"

function Form(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState("");
    const navigate = useNavigate();

        const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post('/api/token/', { username, password });

            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            navigate("/");
        } catch (error) {
            if (error.response && error.response.data && error.response.data.detail) {
                alert(error.response.data.detail);
            } else {
                alert("Ocorreu um erro inesperado. Tente novamente.");
            }
        } finally {
            setLoading(false);
        }
    };
    return <form onSubmit={handleSubmit} className="form-container">
        <h1 className="title-login">Login</h1>
        <input className="form-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuario"/>
        <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha"/>
        {loading && <LoadingIndicator />}
        <button className="form-button" type="submit">Login</button>
    </form>
}

export default Form