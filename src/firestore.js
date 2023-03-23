import { addDoc, collection, doc, onSnapshot, setDoc } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthContext } from "./components/context/UserAuthContext";
import { firestore} from "./firebase";

const useFirestore = () => {

    const {user} = useAuthContext();
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [isProfileSetup, setIsProfileSetup] = useState();
    const USERS_COLLECTION_NAME = "users";

    console.log("firestore data is", data);

     async function addUserToCollection(documentId, documentInfo){
        console.log("user in addUserToCollection", user)
        console.log("collectionName, documentId, documentInfo", documentInfo);
        const customDocRef = doc(firestore, USERS_COLLECTION_NAME, documentId);
        console.log("customDocRef", customDocRef)
        return setDoc(customDocRef, documentInfo);
    }

    useEffect(() => {
        const getDataFromFirestore = async() => {
            if(user){
                console.log("username is", user.uid)

                const unsub = onSnapshot(doc(firestore, USERS_COLLECTION_NAME, user.uid), (doc) => {
                    console.log("doc.data()", doc.data())
                    const documentData =  doc.data();
                    setData(doc.data());
                    setLoading(false);
                });
                return () => unsub();
            }
        };
        getDataFromFirestore();
    }, [user]);

    return {data, addUserToCollection}
};

export default useFirestore;


// Important questions to consider
// TODO: can a person be student and a tutor at the same time? Right now, no, each
// person can only have one student or tutor account


