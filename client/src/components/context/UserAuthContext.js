import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";

const UserAuthContext = createContext();

export function UserAuthContextProvider({children}){

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
            const errorMessage = error.message;
            throw new Error(errorMessage);
        });
        
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
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




