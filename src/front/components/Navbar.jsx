import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("token");
		dispatch({ type: "SET_USER", payload: null });
		navigate("/");
	};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/" className="navbar-brand mb-0 h1">
					React Boilerplate
				</Link>
				<div className="ml-auto d-flex gap-2">
					{store.user ? (
						<>
							<span className="navbar-text me-2">Hola, {store.user.email}</span>
							<button className="btn btn-outline-danger" onClick={handleLogout}>
								Cerrar sesión
							</button>
						</>
					) : (
						<Link to="/">
							<button className="btn btn-primary">Iniciar sesión</button>
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
};
