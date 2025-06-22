import React, { useEffect, useState } from "react";
import { validateToken, logoutUser } from "../services/authService"; 
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";

export const Private = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState("");

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const data = await validateToken();
                dispatch({ type: "set_user", payload: data.user });
                setLoading(false);
            } catch (error) {
                console.error("Error al validar el token:", error);
                setAuthError("Tu sesión ha expirado o es inválida. Por favor, inicia sesión de nuevo.");
                logoutUser();
                dispatch({ type: "set_user", payload: null });
                navigate("/login");
            }
        };

        checkAuth();
    }, [dispatch, navigate]);

    const handleLogout = () => {
        logoutUser();
        dispatch({ type: "set_user", payload: null });
        navigate("/");
    };

    if (loading) {
        return <div className="container text-center mt-5">Cargando contenido privado...</div>;
    }

    if (authError) {
        return (
            <div className="container text-center mt-5">
                <div className="alert alert-danger">{authError}</div>
                <button onClick={() => navigate("/login")} className="btn btn-primary">Ir a iniciar sesión</button>
            </div>
        );
    }

    return (
        <div className="container text-center mt-5">
            <h1>Hola {store.user ? store.user.email : "usuario"}!</h1>
            <p>Bienvenido a tu página privada. Solo puedes ver esto si estás autenticado.</p>
            <p>ID de usuario: {store.user ? store.user.id : "N/A"}</p>
            <button onClick={handleLogout} className="btn btn-danger mt-3">
                Cerrar sesión
            </button>
        </div>
    );
};