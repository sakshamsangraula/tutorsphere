import useFirestore from "../firestore"
import {useState, useEffect} from "react";
import "./../styles/App.css";

export default function HomePage(){

    const {getAllDocs} = useFirestore();
    const {data} = useFirestore();
    console.log("data is", data)

    const [allDocs, setAllDocs] = useState([]);

    const fetchDocs = async () => {
        const docs = await getAllDocs("users");
        const filteredDocs = docs?.filter((doc) => doc.isProfileSetup && doc.userRole === "tutors");
        setAllDocs(filteredDocs);
    }

    useEffect(() => {
        fetchDocs();
    }, [])

    useEffect(() => {
        console.log("all docs", allDocs);
    }, [allDocs]);

    return (
        <div>

            {/*this is the carasoul*/}
            <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
                <ol class="carousel-indicators">
                    <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                </ol>

                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img className="d-block w-100 slide-images" src="https://media.istockphoto.com/id/1353372066/photo/male-university-or-college-student-working-at-computer-in-library-being-helped-by-tutor.jpg?b=1&s=170667a&w=0&k=20&c=xEekRmfc-fcnQ3rXZwVN-6MzT_xJHHwBdRz1PgjbYMs="
                             alt="Second slide" style={{ height: "750px"}}/>
                        <div className="container">
                            <div className="carousel-caption text-left">
                                <h1>TutorSphere.</h1>
                                <p>At our online tutoring platform, we believe that every student has the potential to succeed, regardless of their background or circumstances.
                                    That's why we offer free, high-quality tutoring to underprivileged students. Our expert tutors are here to help you unlock your potential and achieve your academic goals.
                                </p>
                                <p><a className="btn btn-lg btn-primary" href="/register" role="button">Sign up today</a>
                                </p>
                            </div>
                        </div>
                    </div>


                    <div class="carousel-item">
                        <img class="d-block w-100 img-fluid" src="https://www.languagebird.com/wp-content/uploads/2022/03/LB_lessonsBG_dark_3.jpg" alt="Second slide" style={{ height: "750px"}}/>
                        <div className="container">
                            <div className="carousel-caption">
                                <h1>Join a Supportive Community of Learners</h1>
                                <p>Learning can be challenging, but it's much easier when you have a supportive community of peers and mentors. At our online tutoring platform, we've created a welcoming community of learners who are all committed to helping each other succeed. Whether you're looking for help with a tough assignment or just need someone to talk to,
                                    you'll find a supportive group of students and tutors who are here to help you every step of the way.
                                </p>
                                <p><a className="btn btn-lg btn-primary" href="/about" role="/about">Learn more</a></p>           </div>
                        </div>
                    </div>

                    <div class="carousel-item">
                        <img class="d-block w-100 img-fluid" src="https://parentingteensandtweens.com/wp-content/uploads/2022/01/ACT-and-SAT-Is-a-Tutor-Or-A-Course-Right-For-Your-Teen-FB1.jpg" style={{ height: "750px"}}/>
                        <div className="container">
                            <div className="carousel-caption text-right">
                                <h1>Personalized Learning Plans for Every Student</h1>*
                                <p>
                                    We understand that every student has unique needs and learning styles. That's why we create personalized learning plans for every student who joins our platform. Our tutors work with you to identify your strengths and weaknesses,
                                    and then develop a customized plan that's tailored
                                    to your needs. Whether you're struggling with math, science, or language arts, we're here to help.
                                </p>
                                <p><a className="btn btn-lg btn-primary" href="/signin" role="button">Sign in</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                </a>
            </div>

            <br/>

            {/*this is the about me pages fo tutors*/}
            <div class="container marketing">
                <div class="row">
                    <div class="col-lg-4">
                        <img class="rounded-circle" src={allDocs[0]?.url} alt="Generic placeholder image" width="140" height="140"/>
                        <h2>{allDocs[0]?.firstName} {allDocs[0]?.lastName}</h2>
                        <p>{allDocs[0]?.aboutMe}</p>
                        <p><a class="btn btn-secondary" href={`/tutors/${allDocs[0]?.id}`} role="button">View details &raquo;</a></p>
                    </div>
                    <div class="col-lg-4">
                        <img class="rounded-circle" src={allDocs[1]?.url} alt="Generic placeholder image" width="140" height="140"/>
                        <h2>{allDocs[1]?.firstName} {allDocs[1]?.lastName}</h2>
                        <p>{allDocs[1]?.aboutMe}</p>
                        <p><a class="btn btn-secondary" href={`/tutors/${allDocs[1]?.id}`} role="button">View details &raquo;</a></p>
                    </div>
                    <div class="col-lg-4">
                        <img class="rounded-circle" src={allDocs[3]?.url} alt="Generic placeholder image" width="140" height="140"/>
                        <h2>{allDocs[3]?.firstName} {allDocs[3]?.lastName}</h2>
                        <p>{allDocs[3]?.aboutMe}</p>
                        <p><a class="btn btn-secondary" href={`/tutors/${allDocs[3]?.id}`} role="button">View details &raquo;</a></p>
                    </div>
                </div>

                <br/>

                {/*this is the 3 information boxes on the bottom*/}
                <hr class="featurette-divider"/>
                {/*first*/}
                <div class="row featurette">
                    <div class="col-md-7">
                        <h2 class="featurette-heading">What is<span class="text-muted"> TutorSphere?</span></h2>
                        <p class="lead">Welcome to our online tutoring service, where we offer personalized and flexible tutoring to students of all levels and fields of study. We are committed to providing high-quality academic assistance and tailored guidance that aligns with your learning needs and goals.</p>
                    </div>
                    <div class="col-md-5">
                        <img class="featurette-image img-fluid mx-auto" src="https://sdtimes.com/wp-content/uploads/2019/03/developer-4027337_640.png" alt="Image description"/>
                    </div>
                </div>

                {/*second*/}
                <hr class="featurette-divider"/>
                <div class="row featurette">
                    <div class="col-md-7 order-md-2">
                        <h2 class="featurette-heading">What are we about? <span class="text-muted">See for yourself.</span></h2>
                        <p class="lead">
                            At our online tutoring service, we are passionate about making education accessible to all.
                            We believe that every child deserves access to a quality education,
                            regardless of their financial circumstances. To support our cause and help us in this mission, we encourage you to register or sign in to your account and be a part of
                            this movement. Together, we can make a positive impact on the lives of these children and pave the way for a brighter future.
                        </p>
                    </div>
                    <div class="col-md-5 order-md-1">
                        <img class="featurette-image img-fluid mx-auto" src={"https://media.istockphoto.com/id/1231898401/vector/%C3%B0%C3%B1%C3%B0%C3%B0%C3%B0%C3%B0%C3%B1%C3%B0%C2%B5-rgb.jpg?s=612x612&w=0&k=20&c=OpAH1-b7qULawK00Kia-uB9Y8IjBdQ9SuZ_hMph4VS4="} alt="Generic placeholder image"/>
                    </div>
                </div>

                {/*third*/}
                <hr class="featurette-divider"/>
                <div class="row featurette">
                    <div class="col-md-7">
                        <h2 class="featurette-heading">Your Team.<span class="text-muted"> Our Mission.</span></h2>
                        <p class="lead">
                            Our team of experienced tutors specializes in a variety of subjects, including mathematics, sciences, languages, and more. We can help you with coursework, test preparation,
                            essay writing, and skill development. We believe that every student has unique learning strengths and challenges. Our tutors are dedicated to your academic growth and will provide feedback and guidance throughout your tutoring session.
                        </p>
                    </div>
                    <div class="col-md-5">
                        <img class="featurette-image img-fluid mx-auto" src="https://img.freepik.com/premium-vector/online-tutoring-by-students-with-teacher-laptop-screen-illustration-concept_310941-82.jpg" alt="Generic placeholder image"/>
                    </div>
                </div>

                <hr class="featurette-divider"/>
            </div>


            <footer className="container">
                <p className="float-right"><a href="#">Back to top</a></p>
                <p>&copy; 2022-2023 TutorSphere, Inc. &middot; <a href="#">Privacy</a> &middot; <a href="#">Terms</a></p>
            </footer>


        </div>




        // <div className="container marketing">





    );

}

