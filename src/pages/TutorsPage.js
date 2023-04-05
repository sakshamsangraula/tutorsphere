import React from 'react';
import { useAuthContext } from "../components/context/UserAuthContext";
import { collection, getDocs } from "firebase/firestore";
import useFirestore from "../firestore";

import {useEffect, useState} from "react";
import Tutor from '../components/tutors/Tutor';



// need to map through all the user datas
export default function TutorsPage (){

    // for storing tutors
    const [tutors, setTutors] = useState([]);
    const {getAllTutors} = useFirestore();

    // to check and uncheck tutors
    const [favorite, setFavorite] = useState(-1)

    const [favoriteTutorIds, setFavoriteTutorIds] = useState([]);


    // function handleClick(id){
    //     //e.target.favorite.value = !favorite
    //     //id.favorite = !favorite
    //     //setFavorite(!favorite)
    //     favorite === id ? setFavorite(-1) : setFavorite(id);
    //     //setFavorite(id)
    // }

    function changeFavoriteList(tutorId, isFavorite){
        console.log("changeFavoriteList called with ", tutorId, isFavorite)
        if(favoriteTutorIds.includes(tutorId)){
            if(!isFavorite){
                console.log("TUTORID BEING SET TO ", tutorId, isFavorite)
                setFavoriteTutorIds(prevFavorites => {
                    const newFavorites = prevFavorites.filter(tutor => tutor !== tutorId);
                    console.log("newFavorites", newFavorites);
                    return newFavorites;
                })
            }
        }else{
            if(isFavorite){
                setFavoriteTutorIds(prevFavorites => [...prevFavorites, tutorId])
            }
        }
      
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
    // const buttonStyle = {
    //     backgroundColor: favorite ===-1 ? "red" : "white",
    //     color: favorite ===-1? "white" : "black",
    //     padding: "8px 16px",
    //     border: "1px solid black",
    //     borderRadius: "4px",
    //     cursor: "pointer"

    // }

    console.log("favorite tutors", favoriteTutorIds);

    return(
        <div>
            <h1>List of all Tutors</h1>

            <table className="table">
            <thead>
            <tr>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Username</th>
                <th scope="col">Tutor Id</th>
                <th scope="col">Favorite</th>
            </tr>
            </thead>

            <tbody>
            {tutors.map((tutor) =>
                //favorite === tutor.id ? <Stuff/> :

                <Tutor key={tutor.id} tutor={tutor} changeFavoriteList={changeFavoriteList}/>


                // TODO: MOVE THE TDS TO ANOTHER COMPONENT AND GIVE IT A TOGGLE FAVORITE BUTTON
                // HAVE THE STATE HERE AS AN ARRAY OF TUTORS WITH ID AND ISFAVORITE PROPERTY AND THE
                // COMPONENT WILL CALL THE FAVORITE FUNCTION PASSED IN HERE AND THEN THE FAVORITE STATE HERE IS UPDATED FOR THE SPECIFIC TUTOR
                // ALSO ADD THE TUTOR TO ISFAVORITE CHANGES TO FIRESTORE (WHEN FAVORITED, ADD TUTOR TO LIST, WHEN UNFAVORITED REMOVE THE TUTOR FROM THE LIST)
                // <tr>
                //     <td>{tutor?.firstName}</td>
                //     <td>{tutor?.lastName}</td>
                //     <td>{tutor?.username}</td>
                //     <td>
                //         <button style={buttonStyle} onClick={() => handleClick(tutor.id)}>
                //             {/* {favorite ? "Unfavorite" : "Favorite"}  */}
                //             {favorite === tutor.id ? "Unfavorite" : "Favorite"}
                            
                //         </button>
                //     </td>
                // </tr>
            )}
            </tbody>
            </table>


            <p>Favorite tutors are: </p>
            {favoriteTutorIds.map(tutor => <p key={tutor}>{tutor}</p>)}

        </div>
    )



}



