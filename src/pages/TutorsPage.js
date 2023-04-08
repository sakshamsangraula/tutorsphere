import React from 'react';
import { useAuthContext } from "../components/context/UserAuthContext";
import { collection, getDocs } from "firebase/firestore";
import useFirestore from "../firestore";
import "../styles/App.css"

import {useEffect, useState} from "react";



// need to map through all the user datas
export default function TutorsPage (){

    // for storing tutors
    const [tutors, setTutors] = useState([]);
    const {getAllTutors} = useFirestore();

    // to check and uncheck tutors
    const [favorite, setFavorite] = useState(false)

    const handleClick = () => {
        setFavorite(!favorite)
    }

    useEffect(() => {
        fetchData()
        console.log("the tutors", tutors)
    }, [])

    const fetchData = async () => {
        const allTutors = await getAllTutors()
        setTutors(allTutors)
    }

   // const buttonClassName = favorite ? "favorite-button active" : "favorite-button";
    const buttonStyle = {
        backgroundColor: favorite ? "red" : "white",
        color: favorite ? "white" : "black",
        padding: "8px 16px",
        border: "1px solid black",
        borderRadius: "4px",
        cursor: "pointer"
    }

    // for search functionality
    const [search, setSearch] = useState('');
    const handleSearchChange = (e) => {
      setSearch(e.target.value)
    }

    return(
        <div className="table-container">
            <div className="table-header">
                <h2>Tutors</h2>
                <div className="search-container">
                    <input type="text" value={search} onChange={handleSearchChange} placeholder="Search Tutor" />
                    <div className="dropdown-row">
                        {tutors
                            .filter((tutor) => {
                                const searchValue = search.toLowerCase()
                                const fullName = tutor.firstName.toLowerCase() + " " + tutor.lastName.toLowerCase()

                                return (
                                    fullName.startsWith(searchValue) && searchValue
                                )
                            }) // gets a filtered list of tutors who match search value

                            .map((e) => ( // map through the filtered list to access specefic names
                                <div>
                                    <a href={`/tutors/${e.id}`}>{e.firstName} {e.lastName}</a>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

        <div className={"table-responsive"}>
            <table className="table table-striped table-hover table-borderless">
                <thead className={"thead-dark"}>
                <tr>
                    <th>Pic</th>
                    <th scope="col">Full Name</th>
                    <th scope="col">Username</th>
                    <th scope="col">Favorite</th>
                </tr>
                </thead>
                <tbody>
                {tutors
                    .filter((tutor) => tutor.isProfileSetup)
                    .map((tutor) =>
                    <tr>
                        <td>
                            <div className="d-flex align-items-center">
                                <img className="rounded-circle"
                                     src={tutor?.url}
                                     width="50"/>
                            </div>
                        </td>

                        <td>
                            <a href={`/tutors/${tutor?.id}`}>
                                {tutor?.firstName} {tutor?.lastName}
                            </a>
                        </td>
                        <td>{tutor?.username}</td>
                        <td>
                            <button style={buttonStyle} onClick={handleClick}>
                                {favorite ? "Unfavorite" : "Favorite"}
                            </button>
                        </td>
                    </tr>
                )}
                </tbody>


            </table>

        </div>
        </div>

    )



}



