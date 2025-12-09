import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./component/home/Home";
import About from "./component/about/About";
import Navbar from "./component/navbar/Navbar";
import Contact from "./component/contact/Contact";
import UserLogin from "./component/userCard/login/UserLogin";
import UserSignup from "./component/userCard/signup/UserSignup";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { IUser } from "./helpers/interface";

function App() {
  const [userState, setUserState] = useState<IUser | any>({
    email: "",
    password: "",
    fullName: "",
    confirmPassword: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    !!userState?.email || false
  );

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(userState));
  }, [userState]);

  return (
    <div className="App">
      <Toaster />

      <Routes>
        <Route
          element={
            <Navbar
              user={userState}
              isLoggedIn={isLoggedIn}
              setUserState={setUserState}
              setIsLoggedIn={setIsLoggedIn}
            />
          }
        >
          <Route
            path="/"
            element={
              <Home
                setIsLoggedIn={setIsLoggedIn}
                userState={userState}
                setUserState={setUserState}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/auth/login"
            element={
              <UserLogin
                userState={userState}
                setUserState={setUserState}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
              />
            }
          />

          <Route
            path="/auth/register"
            element={
              <UserSignup userState={userState} setUserState={setUserState} />
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
