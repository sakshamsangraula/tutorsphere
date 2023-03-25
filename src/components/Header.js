import { Link, useNavigate } from "react-router-dom";
import SignIn from "./authentication/SignIn";
import SignUp from "./authentication/SignUp";
import { useAuthContext } from "./context/UserAuthContext";

export default function Header(){
    const {user, logout} = useAuthContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };
    


    return (
        <nav className="navbar navbar-light bg-light">
            <Link className="navbar-brand" to="/">Tutorsphere</Link>
            <Link className="navbar-brand" to="/about">About</Link>
            <Link className="navbar-brand" to="/appointments">Appointments</Link>
            <Link className="navbar-brand" to="/profile">Profile</Link>


{/* TODO: fix register/signin in navbar showing up for around 1 second when refreshing the site while the user is login */}
            {user && <a className="link-dark" style={{cursor: "pointer"}} onClick={handleLogout}>Logout</a>}
            {user && <p>{user.email}</p>}
            {!user && <Link className="navbar-brand" to="/register">Register</Link>}
            {!user && <Link className="navbar-brand" to="/signin">Sign In</Link>}
        </nav>
    )
}