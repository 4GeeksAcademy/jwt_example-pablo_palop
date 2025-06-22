const API_URL = "https://cautious-disco-5w45g9gpj47c4jwg-3001.app.github.dev/api";

export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.msg || data.error || "Login fallido");
        }
        sessionStorage.setItem("token", data.token);
        return data;
    } catch (error) {
        throw error;
    }
};

export const createUser = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/user/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.msg || data.error || "Error al crear usuario");
        }

        return data;
    } catch (error) {
        throw error;
    }
};

export const validateToken = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
        throw new Error("No hay token en sessionStorage.");
    }

    try {
        const response = await fetch(`${API_URL}/private`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.msg || data.error || "Token inválido o expirado");
        }

        return { user: data.user };
    } catch (error) {
        throw error;
    }
};

export const logoutUser = () => {
    sessionStorage.removeItem("token");
};
