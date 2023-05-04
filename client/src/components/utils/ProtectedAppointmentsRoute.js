import { Navigate } from "react-router-dom";
import useFirestore from "../../firestore";
import { useAuthContext } from "../context/UserAuthContext";

export default function ProtectedAppointmentsRoute({children}){
    const {user} = useAuthContext();
    const {data} = useFirestore();

    if (!user){
        return <Navigate to='/' />
    }

    // only tutors who have setup their profiles can access the appointments route
    if(data?.userRole === "tutors" && !data?.isProfileSetup){
        alert("You need to have profile setup to access appointments!");
        return <Navigate to="/" />
    }
    return children;
}