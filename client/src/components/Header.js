import {useNavigate} from "react-router-dom";
import { useAuthContext } from "./context/UserAuthContext";
import Dropdown from 'react-bootstrap/Dropdown';
import useFirestore from "../firestore";
import "../styles/App.css";
import React, {useEffect, useState} from "react";


export default function Header(){
    const {user, logout} = useAuthContext();
    const {data} = useFirestore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };
    const [tutors, setTutors] = useState([]);
    const {getAllTutors} = useFirestore();

    useEffect(() => {
        fetchData()
        console.log("the tutors", tutors)
    }, [])

    const fetchData = async () => {
        const allTutors = await getAllTutors()
        setTutors(allTutors)
    }

    // for search functionality
    const [search, setSearch] = useState('');
    return (
        <header>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                <a className="navbar-brand" href="/">TutorSphere</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
                    aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
                <ul className="navbar-nav mr-auto ml-auto">
                    <li className="nav-item active">
                        <a className="nav-link" href="/about">About<span className="sr-only"></span></a>
                    </li>
                    {data?.userRole === "students" ?
                        <li className="nav-item">
                            <a className="nav-link" href="/tutors">Tutors</a>
                        </li> :
                        <li className="nav-item">
                            <a  className="nav-link disabled" href="/tutors">Tutors</a>
                        </li>
                    }


                    }

                    {user &&
                        <li className="nav-item active">
                            <a className="nav-link" href="/appointments" onClick={(e) => {
                                e.preventDefault();
                                navigate('/appointments');
                            }}>Appointments<span className="sr-only"></span></a>
                        </li>
                    }

                    {!user &&
                        <li className="nav-item">
                            <a className="nav-link" href="/register">Register</a>
                        </li>
                    }
                    {!user &&
                        <li className="nav-item">
                            <a className="nav-link" href="/signin">Sign In</a>
                        </li>
                    }

                </ul>


                {user && (
                    <div className="d-flex justify-content-between move-right">
                        <div className="search-container position-relative">
                            {data?.userRole === "students" &&
                            <input className="form-control mr-sm-2" type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Tutors" aria-label="Search" />}
                                {search &&
                                <div className="dropdown-row">
                                    {tutors
                                        .filter((tutor) => {
                                            const searchValue = search.toLowerCase()
                                            const fullName = tutor.firstName.toLowerCase() + " " + tutor.lastName.toLowerCase()

                                            return (
                                                fullName.startsWith(searchValue) && searchValue
                                            )
                                        }) // gets a filtered list of tutors who match search value

                                        .map((tutor) => ( // map through the filtered list to access specific names
                                            <div>
                                                <a href={`/tutors/${tutor?.id}`}>{tutor?.firstName} {tutor?.lastName}</a>
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                        </div>
                        <Dropdown>
                            <Dropdown.Toggle variant="link" id="dropdown-basic">
                                {user?.email}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => navigate("/profile")}>Profile</Dropdown.Item>
                                {data?.userRole === "students" && <Dropdown.Item onClick={() => navigate("/favorites")}>Favorited Tutors</Dropdown.Item>}
                                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                )}



            </div>
        </nav>
        </header>

    )
}