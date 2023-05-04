import { collection, getDocs } from "firebase/firestore";
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
    <div>
      <h2>Favorite Tutors</h2>
      <ul>
        {favoriteTutors.map((tutor) => (
          <li key={tutor.id}>{tutor.firstName} {tutor.lastName}</li>
        ))}
      </ul>
    </div>
  );
}
/*
import { collection, getDocs } from "firebase/firestore";
import useFirestore from "../firestore";
import { useEffect, useState } from "react";


export default function MyComponent() {
  const { getAllTutors } = useFirestore();
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const allTutors = await getAllTutors();
      setTutors(allTutors);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h2>Tutors</h2>
      <ul>
        {tutors.map((tutor) => (
          <li key={tutor.id}>{tutor.firstName} {tutor.lastName}</li>
        ))}
      </ul>
    </div>
  );
}
*/