import { useParams } from "react-router-dom";
import useFirestore from "../firestore";
import { useEffect, useState } from "react";

export default function SingleTutorPage() {

    const { id } = useParams();
    const { fetchDocumentById } = useFirestore();
    const [tutor, setTutor] = useState();

    useEffect(() => {
        async function getAndSetTutorBasedOnId() {
            try {
                const tutorData = await fetchDocumentById("users", id);
                setTutor(tutorData);
            } catch (error) {
                console.error("Error getting user by id", error);
            }
        }

        getAndSetTutorBasedOnId();
    }, [fetchDocumentById, id]);

    return (
        <div className="container py-5">

            {/*this is for the left card with the image*/}
            <div className="row">
                <div className="col-lg-4">
                    <div className="card mb-4">
                        <div className="card-body text-center">
                            <img
                                src={tutor?.url ? tutor.url : ""}
                                alt="avatar"
                                className="rounded-circle img-fluid avatar-image mb-2" />

                            <h5 className="my-3">{tutor?.firstName} {tutor?.lastName}</h5>
                            <p className="text-muted mb-1">{tutor?.userRole}</p>

                        </div>
                    </div>
                </div>

                {/*this is for the right card section*/}
                <div className="col-lg-8">
                    <div className="card mb-4">
                        <div className="card-body">

                            <div className="row">
                                <div className="col-sm-3">
                                    <p className="mb-0">First Name</p>
                                </div>
                                <div className="col-sm-9">
                                    <p className="text-muted mb-0">{tutor?.firstName}</p>
                                </div>
                            </div>

                            <hr></hr>
                            <div className="row">
                                <div className="col-sm-3">
                                    <p className="mb-0">Last Name</p>
                                </div>
                                <div className="col-sm-9">
                                    <p className="text-muted mb-0">{tutor?.lastName}</p>
                                </div>
                            </div>

                            <hr />
                            <div className="row">
                                <div className="col-sm-3">
                                    <p className="mb-0">Email</p>
                                </div>
                                <div className="col-sm-9">
                                    <p className="text-muted mb-0">{tutor?.email || ""}</p>
                                </div>
                            </div>

                            <hr />
                            <div className="row">
                                <div className="col-sm-3">
                                    <p className="mb-0">Account Type</p>
                                </div>
                                <div className="col-sm-9">
                                    <p className="text-muted mb-0">{tutor?.userRole}</p>
                                </div>
                            </div>

                            <hr />
                            <div className="row">
                                <div className="col-sm-3">
                                    <p className="mb-0">Username</p>
                                </div>
                                <div className="col-sm-9">
                                    <p className="text-muted mb-0">{tutor?.username}</p>
                                </div>
                            </div>

                            <hr />
                            <div className="row">
                                <div className="col-sm-3">
                                    <p className="mb-0">Subjects</p>
                                </div>
                                <div className="col-sm-9">
                                    <p className="text-muted mb-0">{tutor?.subjects}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>

    )
}