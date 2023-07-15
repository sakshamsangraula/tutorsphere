import { useParams } from "react-router-dom";
import useFirestore from "../firestore";
import { useEffect, useState } from "react";

function AppointmentDetailPage() {
    const { id } = useParams();
    const { fetchDocumentById } = useFirestore();
    const [appointment, setAppointment] = useState();

    useEffect(() => {
        async function getAndSetAppointmentById() {
            try {
                const appointmentData = await fetchDocumentById("appointments", id);
                setAppointment(appointmentData);
            } catch (error) {
                console.error("Error getting user by id", error);
            }
        }
        getAndSetAppointmentById();
    }, [fetchDocumentById, id]);

    return (

        <div>
            <h2 className="mt-4 mb-3 text-center">Appointment Detail</h2>
            <div className="col-lg-8">
                <div className="card mb-4">
                    <div className="card-body">

                        <div className="row">
                            <div className="col-sm-3">
                                <p className="mb-0">Appointment ID</p>
                            </div>
                            <div className="col-sm-9">
                                <p className="text-muted mb-0">{id}</p>
                            </div>
                        </div>

                        <hr></hr>

                        <div className="row">
                            <div className="col-sm-3">
                                <p className="mb-0">Student Name</p>
                            </div>
                            <div className="col-sm-9">
                                <p className="text-muted mb-0">{appointment?.studentName}</p>
                            </div>
                        </div>

                        <hr></hr>
                        <div className="row">
                            <div className="col-sm-3">
                                <p className="mb-0">Tutor Name</p>
                            </div>
                            <div className="col-sm-9">
                                <p className="text-muted mb-0">{appointment?.tutorName}</p>
                            </div>
                        </div>

                        <hr />
                        <div className="row">
                            <div className="col-sm-3">
                                <p className="mb-0">Start Date and Time</p>
                            </div>
                            <div className="col-sm-9">
                                <p className="text-muted mb-0">{appointment?.startTime}</p>
                            </div>
                        </div>

                        <hr />
                        <div className="row">
                            <div className="col-sm-3">
                                <p className="mb-0">End Date and Time</p>
                            </div>
                            <div className="col-sm-9">
                                <p className="text-muted mb-0">{appointment?.endTime}</p>
                            </div>
                        </div>

                        <hr />
                        <div className="row">
                            <div className="col-sm-3">
                                <p className="mb-0">Subjects</p>
                            </div>
                            <div className="col-sm-9">
                                <p className="text-muted mb-0">{appointment?.subjects?.join(", ")}</p>
                            </div>
                        </div>

                        <hr />
                        <div className="row">
                            <div className="col-sm-3">
                                <p className="mb-0">Notes/Description</p>
                            </div>
                            <div className="col-sm-9">
                                <p className="text-muted mb-0">{appointment?.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )

}

export default AppointmentDetailPage;