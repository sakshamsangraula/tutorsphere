import useFirestore from "../firestore";
import { useEffect, useState } from "react";

export default function FavoritesPage() {
    const { data } = useFirestore();
    const { getAllTutors } = useFirestore();
    const [tutors, setTutors] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const allTutors = await getAllTutors();
            setTutors(allTutors);
        }
        fetchData();
    }, []);

    const favoriteTutorIds = data?.favoriteList || [];
    console.log("favoriteTutorIdsinfavs", favoriteTutorIds)
    const favoriteTutors = tutors.filter((tutor) => favoriteTutorIds.includes(tutor.id));

    return (
        <div className="container">
            <h2 className="my-4 text-center text-danger">Favorite Tutors</h2>
            <table className="table table-striped table-hover">
                <thead className="thead-dark">
                <tr>
                    <th scope="col">Tutor Name</th>
                    <th scope="col">Email</th>
                </tr>
                </thead>
                <tbody>
                {favoriteTutors.map((tutor) => (
                    <tr key={tutor.id}>
                        <td>
                            <a href={`/tutors/${tutor?.id}`}>
                                {tutor?.firstName} {tutor?.lastName}
                            </a>
                        </td>
                        <td>{tutor?.email}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
