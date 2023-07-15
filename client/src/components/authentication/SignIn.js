import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/UserAuthContext";
import { Alert } from "react-bootstrap";

export default function SignIn() {

    const { login } = useAuthContext();
    const navigate = useNavigate();

    const [authInfo, setAuthInfo] = useState({
        email: "",
        password: ""
    });

    const [alert, setAlert] = useState({
        variant: "success",
        message: "",
        show: false,
    });

    const handleAuthChange = (e) => {
        const { name, value } = e.target;
        setAuthInfo({ ...authInfo, [name]: value });
    };

    // TODO: make sure all values are filled and clean/trim before validating and submitting
    const handleSubmit = async () => {
        try {
            if (!authInfo.email || !authInfo.password) {
                throw new Error("You must provide both email and password to log in.")
            }
            // TODO: decide whether response is needed or not
            const response = await login(authInfo.email, authInfo.password);
            navigate("/profile")
        } catch (err) {
            setAlert(prevAlert => { return { ...prevAlert, variant: "danger", message: "Error logging in. Your username or password is incorrect", show: true } });
        }
    };
    return (
        <div>
            <div className="vh-100 bg-image"
                style={{ backgroundImage: "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')" }}>
                <div className="mask d-flex align-items-center h-100 gradient-custom-3">
                    <div className="container h-100">
                        <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                                <div className="card" style={{ borderRadius: "15px" }}>
                                    <div className="card-body p-4">
                                        {alert.show && <Alert variant={alert.variant} onClose={() => setAlert(prevAlert => { return { ...prevAlert, show: false } })} dismissible>
                                            {alert.message}
                                        </Alert>}
                                        <h2 className="text-center mb-5">Login to Tutorsphere</h2>

                                        <form onSubmit={handleSubmit}>

                                            <div className="form-outline mb-4">
                                                <label className="form-label">Email address</label>
                                                <input required name="email" type="email" className="form-control form-control-lg" value={authInfo.email} onChange={handleAuthChange} />
                                            </div>
                                            <div className="form-outline mb-4">
                                                <label className="form-label">Password</label>
                                                <input required name="password" type="password" className="form-control form-control-lg" value={authInfo.password} onChange={handleAuthChange} />
                                            </div>
                                            <div className="d-flex justify-content-center">
                                                <button type="button" onClick={handleSubmit}
                                                    className="btn btn-success btn-block btn-lg gradient-custom-4 text-body">Login</button>
                                            </div>
                                            <p className="text-center text-muted mt-2 mb-0"> <a onClick={() => navigate("/forgotPassword")} style={{ cursor: "pointer" }}
                                                className="fw-bold text-body"><u>Forgot Password</u></a></p>
                                            <p className="text-center text-muted mt-5 mb-0">Don't have an account? <a onClick={() => navigate("/register")} style={{ cursor: "pointer" }}
                                                className="fw-bold text-body"><u>Register here</u></a></p>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}