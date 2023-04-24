import { createContext, Profiler, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updatePassword, sendPasswordResetEmail } from "firebase/auth";
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

    function changePassword(email){
        sendPasswordResetEmail(auth, email)
        .then(() => {
            Promise.resolve();
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("errormessage"+errorMessage);
            Promise.reject(errorMessage);
        });
        // console.log("newPassword" + newPassword);
        // console.log("user"+user);
        // const emailExists = auth().getUserByEmail(email).then(() => true).catch(() => false);
        // console.log("user"+user);
        // if(emailExists){
        //     console.log("user"+user);
        //     return updatePassword(user, newPassword);
        // }
        // else{
        //     Promise.reject("User not found");
        // }
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
        <UserAuthContext.Provider value={{user, registerUser, login, logout, changePassword}}>
            {children}
        </UserAuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(UserAuthContext);




