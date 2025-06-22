import React, { useState } from "react";
import { loginUser, createUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {
    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);

    const handleSubmit = async () => {
        try {
            if (isRegistering) {
                const res = await createUser(email, password);
                setSuccess(res.msg);
                setError("");
                setIsRegistering(false);
                setEmail("");
                setPassword("");
            } else {
                const data = await loginUser(email, password);
                dispatch({ type: "set_user", payload: data.user });
                setError("");
                navigate("/private");
            }
        } catch (error) {
            setError(error.message);
            setSuccess("");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="text-center" style={{ maxWidth: "400px", width: "100%" }}>
                <h1 className="mb-4">{isRegistering ? "Crea tu cuenta" : "Inicia sesión"}</h1>
                <div className="mb-3">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <div className="text-danger mb-3">{error}</div>}
                {success && <div className="text-success mb-3">{success}</div>}
                <button onClick={handleSubmit} className="btn btn-primary w-100 mb-3">
                    {isRegistering ? "Registrarse" : "Iniciar sesión"}
                </button>
                <button
                    onClick={() => {
                        setIsRegistering(!isRegistering);
                        setError("");
                        setSuccess("");
                        setEmail("");
                        setPassword("");
                    }}
                    className="btn btn-link"
                >
                    {isRegistering ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
                </button>
            </div>
        </div>
    );
};