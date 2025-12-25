import { Routes, Route } from "react-router-dom";
import { LandingPage } from "../../features/landing";
import { About } from "../../features/about";
import { Contact } from "../../features/contact";
import { UserLogin, UserSignup } from "../../features/auth";
import Navbar from "../../shared/ui/navbar/Navbar";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Navbar />}>
        <Route path="/auth/login" element={<UserLogin />} />
        <Route path="/auth/register" element={<UserSignup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<LandingPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
