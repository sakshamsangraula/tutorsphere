import { useState } from "react";

function Tutor({tutor, changeFavoriteList}){

    const[isFavorite, setIsFavorite] = useState(false);

    function toggleFavorite(tutorId, favoriteStatus){
        const newFavoriteStatus = !isFavorite;
        setIsFavorite(newFavoriteStatus);
        changeFavoriteList(tutorId, newFavoriteStatus);
    }
    const buttonStyle = {
        backgroundColor: isFavorite? "red" : "white",
        color: isFavorite? "white" : "black",
        padding: "8px 16px",
        border: "1px solid black",
        borderRadius: "4px",
        cursor: "pointer"

    }
    return (
        <tr>
        <td>{tutor?.firstName}</td>
        <td>{tutor?.lastName}</td>
        <td>{tutor?.username}</td>
        <td>{tutor?.id}</td>
        <td>
            <button style={buttonStyle} onClick={() => toggleFavorite(tutor.id, isFavorite)}>
                {/* {favorite ? "Unfavorite" : "Favorite"}  */}
                {isFavorite ? "Unfavorite" : "Favorite"}
                
            </button>
        </td>
    </tr>
    )
}
export default Tutor;