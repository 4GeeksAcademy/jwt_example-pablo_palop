import React, { useState } from "react";
import { loginUser } from "../services/authService";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {
    const { store, dispatch } = useGlobalReducer();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            const data = await loginUser(email, password);
            localStorage.setItem("token", data.token);
            dispatch({ type: "SET_USER", payload: data.user });
            setError("");
            alert("Login exitoso");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="text-center">
                <h1 className="mb-4">Welcome to NETFLIX</h1>
                <h2 className="mb-3">Enter your email:</h2>
                <div className="mb-3">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <h2 className="mb-3">Enter your password:</h2>
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <div className="text-danger mb-3">{error}</div>}
                <button onClick={handleLogin} className="btn btn-primary">Continue</button>
            </div>
        </div>
    );
};
