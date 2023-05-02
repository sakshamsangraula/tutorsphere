import { Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "./context/UserAuthContext";
import { useEffect, useState } from "react";

export default function ProtectedRoute({children}){
    const {user, loading} = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user){
            navigate("/");
        }
    }, [user, loading])

    // if(!user){
    //     return <Navigate to="/">
    // }

    return children;
}