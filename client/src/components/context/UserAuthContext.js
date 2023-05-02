import { createContext, Profiler, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updatePassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import App from "../../App";
import Header from "../Header";

const UserAuthContext = createContext();

export function UserAuthContextProvider({children}){

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // const [userRole, setUserRole] = useState(null);

    // function updateUserRole(roleName){
    //     setUserRole(roleName);
    // }

    // console.log("userRole in userauthcontext", userRole)

    console.log("USERISLOGGEDINORNOT", user)

    function registerUser(email, password){
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function login(email, password){
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout(){
        return auth.signOut();
    }

    function changePassword(email){
        return sendPasswordResetEmail(auth, email)
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("errormessage"+errorMessage);
            throw new Error(errorMessage);
        });
        
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("user in userauthcontext is", user)
            if(user){
                setUser(user);
                setLoading(false);
            }else{
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);
    
    return (
        <UserAuthContext.Provider value={{user, loading, registerUser, login, logout, changePassword}}>
            {children}
        </UserAuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(UserAuthContext);




