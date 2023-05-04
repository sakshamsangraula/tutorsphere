import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./context/UserAuthContext";
import { useEffect } from "react";

export default function ProtectedRoute({children}){
    const {user, loading} = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user){
            navigate("/");
        }
    }, [user, loading])

    return children;
}