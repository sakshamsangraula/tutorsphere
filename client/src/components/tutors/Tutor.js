import { useState } from "react";
import { useEffect } from "react";

function Tutor({ tutor, changeFavoriteList, favoritesList }) {
    const [isFavorite, setIsFavorite] = useState(false);
    
    useEffect(() => {
        if(favoritesList.includes(tutor?.id)){
            setIsFavorite(true);
        }else{
            setIsFavorite(false);
        }
    }, [tutor, favoritesList]);

    function toggleFavorite(tutorId, favoriteStatus) {
        const newFavoriteStatus = !isFavorite;
        setIsFavorite(newFavoriteStatus);
        changeFavoriteList(tutorId, newFavoriteStatus);
    }
    const buttonStyle = {
        backgroundColor: isFavorite ? "red" : "white",
        color: isFavorite ? "white" : "black",
        padding: "8px 16px",
        border: "1px solid black",
        borderRadius: "4px",
        cursor: "pointer"
    }

    return (
        <tr>
            <td>
                <div className="d-flex align-items-center">
                    <img className="rounded-circle"
                        src={tutor?.url}
                        width="50" />
                </div>
            </td>

            <td>
                <a href={`/tutors/${tutor?.id}`}>
                    {tutor?.firstName} {tutor?.lastName}
                </a>
            </td>
            <td>{tutor?.username}</td>
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