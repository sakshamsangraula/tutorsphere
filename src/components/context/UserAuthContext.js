import { createContext, Profiler, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import App from "../../App";
import Header from "../Header";

const UserAuthContext = createContext();

export function UserAuthContextProvider({children}){

    const [user, setUser] = useState(null);
    // const [userRole, setUserRole] = useState(null);

    // function updateUserRole(roleName){
    //     setUserRole(roleName);
    // }

    // console.log("userRole in userauthcontext", userRole)

    function registerUser(email, password){
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function login(email, password){
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout(){
        return auth.signOut();
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("user in userauthcontext is", user)
            if(user){
                setUser(user);
            }else{
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);
    
    return (
        <UserAuthContext.Provider value={{user, registerUser, login, logout}}>
            {children}
        </UserAuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(UserAuthContext);




