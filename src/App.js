import { UserAuthContextProvider } from "./components/context/UserAuthContext";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignIn from "./components/authentication/SignIn";
import SignUp from "./components/authentication/SignUp";
import AppointmentsPage from "./pages/AppointmentsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";

function App(){
    return (
        <UserAuthContextProvider>
            <div>
                <Header />

                {/* TODO: show a message in homepage saying user profile is not set and link to /profileSetup or appointment page for tutor
// which has availability picker */}

                <Routes>
                    <Route path="/" element={<HomePage />}></Route>
                    <Route path="/register" element={<SignUp />}></Route>
                    <Route path="/signin" element={<SignIn />}></Route>
                    <Route path="/appointments" element={
                        <ProtectedRoute>
                            <AppointmentsPage />
                        </ProtectedRoute>
                    }></Route>
                    <Route path="/profile" element = {
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }></Route>
                </Routes>
            </div>
        </UserAuthContextProvider>
    )
}

export default App;