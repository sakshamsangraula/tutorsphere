import { UserAuthContextProvider } from "./components/context/UserAuthContext";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import SignIn from "./components/authentication/SignIn";
import SignUp from "./components/authentication/SignUp";
import ForgotPassword from "./components/authentication/ForgotPassword";
import AppointmentsPage from "./pages/AppointmentsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import TutorsPage from "./pages/TutorsPage";
import ProtectedAppointmentsRoute from "./components/utils/ProtectedAppointmentsRoute";
import SingleTutorPage from "./pages/SingleTutorPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import AppointmentDetailPage from "./pages/AppointmentDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import Footer from "./Footer";


function App(){
    return (
        <UserAuthContextProvider>
            <div className={"App"}>
                <Header />

                {/* TODO: show a message in homepage saying user profile is not set and link to /profileSetup or appointment page for tutor
// which has availability picker */}
                <main className={'App-main'}>
                <Routes>
                    <Route path="/" element={<HomePage />}></Route>
                    <Route path="/about" element={<About />}></Route>
                    <Route path="/register" element={<SignUp />}></Route>
                    <Route path="/forgotPassword" element={<ForgotPassword />}></Route>
                    <Route path="/signin" element={<SignIn />}></Route>
                    <Route path="/reservations" element={
                        <ProtectedAppointmentsRoute>
                            <AppointmentsPage />
                        </ProtectedAppointmentsRoute>
                    }></Route>
                    <Route path="/reservations/:id" element={
                        <ProtectedAppointmentsRoute>
                            <AppointmentDetailPage />
                        </ProtectedAppointmentsRoute>
                    }></Route>
                    <Route path="/profile" element = {
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }></Route>
                        <Route path="/tutors/:id" element = {
                         <ProtectedRoute>
                            <SingleTutorPage />
                         </ProtectedRoute>
                    }></Route>
                    <Route path="/tutors" exact element = {
                        <ProtectedRoute>
                            <TutorsPage />
                        </ProtectedRoute>
                    }></Route>
                     <Route path="/favorites" element = {
                        <ProtectedRoute>
                            <FavoritesPage />
                        </ProtectedRoute>
                    }></Route>

                </Routes>
            </main>
                <Footer/>
            </div>

        </UserAuthContextProvider>
    )
}

export default App;
