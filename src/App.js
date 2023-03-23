import { UserAuthContextProvider } from "./components/context/UserAuthContext";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignIn from "./components/authentication/SignIn";
import SignUp from "./components/authentication/SignUp";
import AppointmentsPage from "./pages/AppointmentsPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App(){
    return (
        <UserAuthContextProvider>
            <div>
                <Header />

                <Routes>
                    <Route path="/" element={<HomePage />}></Route>
                    <Route path="/register" element={<SignUp />}></Route>
                    <Route path="/signin" element={<SignIn />}></Route>
                    <Route path="/appointments" element={
                        <ProtectedRoute>
                            <AppointmentsPage />
                        </ProtectedRoute>
                    }></Route>
                </Routes>
            </div>
        </UserAuthContextProvider>
    )
}

export default App;