import { addDoc, collection, doc, getDocs, onSnapshot, setDoc, updateDoc } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthContext } from "./components/context/UserAuthContext";
import { firestore} from "./firebase";

const useFirestore = () => {

    const {user} = useAuthContext();
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [isProfileSetup, setIsProfileSetup] = useState();
    const [appointmentsData, setAppointmentsData] = useState([]);
    const USERS_COLLECTION_NAME = "users";

    console.log("firestore data is", data);

    async function addDocumentToCollectionWithDefaultId(COLLECTION_NAME, documentInfo){
        const docRef = await addDoc(collection(firestore, COLLECTION_NAME), documentInfo);
        return docRef;
    }

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
        // gets data for specific user document (current document)
        const getDataFromFirestore = async() => {
            if(user){
                console.log("username is", user.uid)

                const unsub = onSnapshot(doc(firestore, USERS_COLLECTION_NAME, user.uid), (doc) => {
                    console.log("doc.data()", doc.data())
                    const documentData =  doc.data();
                    setData({id: doc.id, ...doc.data()});
                    setLoading(false);
                });
                return () => unsub();
            }
        };
        getDataFromFirestore();

        const getAppointmentsDataFromFirestore = async() => {
            if(user){
                const collectionRef = collection(firestore, "appointments");

                const allAppointments = [];
                const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
                snapshot.forEach((doc) => {
                    allAppointments.push({id: doc.id, ...doc.data()});         
                    });
                });
                setAppointmentsData(allAppointments);
                return () => unsubscribe();
            }
        }

        getAppointmentsDataFromFirestore();
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

      async function getAllSubjects(){
        const allUsersData = await getAllDocs("users");
        const uniqueSubjects = new Set();
        allUsersData?.forEach(user => {
            user?.subjects?.forEach(subject => {
                uniqueSubjects.add(subject);
            });
        });
        return Array.from(uniqueSubjects);
      }

      async function getCurrentUserAppointments(){
        // const allAppointments = await getAllDocs("appointments");
        const currentUserAppointments = appointmentsData.filter(appointment => {
            if(data?.userRole === "tutors"){
                return appointment?.tutorId === data?.id;
            }else if(data?.userRole === "students"){
                return appointment?.studentId === data?.id;
            }
        });
        return currentUserAppointments;
      }

      async function getCurrentUserFutureAppointments(){
        const allCurrentUserAppointments = await getCurrentUserAppointments();
        const now = new Date();
        const currentUserFutureAppointments = allCurrentUserAppointments.filter(appointment => {
            const appointmentDate = new Date(appointment.startTime);
            if(appointmentDate > now){
                return true;
            }else{
                return false;
            }
        });
        return currentUserFutureAppointments;
      }


    return {data, addDocumentToCollection, updateDocument, getAllDocs, getAllTutors, getAllSubjects, addDocumentToCollectionWithDefaultId, getCurrentUserFutureAppointments, appointmentsData}
};

export default useFirestore;


// Important questions to consider
// TODO: can a person be student and a tutor at the same time? Right now, no, each
// person can only have one student or tutor account


