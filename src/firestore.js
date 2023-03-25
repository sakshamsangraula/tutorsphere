import { addDoc, collection, doc, getDocs, onSnapshot, setDoc, updateDoc } from "@firebase/firestore";
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

     async function addDocumentToCollection(COLLECTION_NAME, documentId, documentInfo){
        const customDocRef = doc(firestore, COLLECTION_NAME, documentId);
        return setDoc(customDocRef, documentInfo);
    }

    async function updateDocument(COLLECTION_NAME, documentId, newField){
        console.log("UPDATE DOCUMENT ******** COLLECTION_NAME, documentId, newField", COLLECTION_NAME, documentId, newField)
        const documentRef = doc(firestore, COLLECTION_NAME, documentId);
        return updateDoc(documentRef, newField)
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

    const getAllDocs = async (collectionName) => {
        const querySnapshot = await getDocs(collection(firestore, collectionName));
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() });
        });
        return docs;
      };

      async function getAllTutors(){
        const allUsersData = await getAllDocs("users");
        const allTutors = allUsersData.filter(user => user.userRole === "tutors");
        return allTutors;
      }

    return {data, addDocumentToCollection, updateDocument, getAllDocs, getAllTutors}
};

export default useFirestore;


// Important questions to consider
// TODO: can a person be student and a tutor at the same time? Right now, no, each
// person can only have one student or tutor account


