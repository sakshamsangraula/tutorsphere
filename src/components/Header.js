import { Link, useNavigate} from "react-router-dom";
import SignIn from "./authentication/SignIn";
import SignUp from "./authentication/SignUp";
import { useAuthContext } from "./context/UserAuthContext";
import Dropdown from 'react-bootstrap/Dropdown';


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
            <Link className="navbar-brand" to="/tutors">Tutors</Link>
            <Link className="navbar-brand" to="/appointments">Appointments</Link>


{/* TODO: fix register/signin in navbar showing up for around 1 second when refreshing the site while the user is login */}
{/*            {user && <a className="link-dark" style={{cursor: "pointer"}} onClick={handleLogout}>Logout</a>}*/}
            {user &&
                <Dropdown>
                    <Dropdown.Toggle variant="link" id="dropdown-basic">
                        {user?.email}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => navigate("/profile")}>Profile</Dropdown.Item>
                        <Dropdown.Item onClick={() => navigate("/favorites")}>Favroited Tutors</Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            }

            {!user && <Link className="navbar-brand" to="/register">Register</Link>}
            {!user && <Link className="navbar-brand" to="/signin">Sign In</Link>}
        </nav>
    )
}