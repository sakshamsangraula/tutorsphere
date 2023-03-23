import useFirestore from "../firestore"

export default function HomePage(){

    const {data} = useFirestore();
    console.log("data is", data)
    return (
        <div>
            HomePage
        </div>
    )
}