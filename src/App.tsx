import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./component/home/Home";
import About from "./component/about/About";
import Navbar from "./component/navbar/Navbar";
import Contact from "./component/contact/Contact";
import UserLogin from "./component/userCard/login/UserLogin";
import UserSignup from "./component/userCard/signup/UserSignup";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import { IUser } from "./helpers/interface";

function App() {
  const [userState, setUserState] = useState<IUser | any>({
    email: "",
    password: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

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
            />
          }
        >
          <Route
            path="/"
            element={<Home userState={userState} setUserState={setUserState} />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route
            path="/auth/login"
            element={
              <UserLogin
                userState={userState}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                setUserState={setUserState}
              />
            }
          />
          <Route path="/auth/register" element={<UserSignup />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
