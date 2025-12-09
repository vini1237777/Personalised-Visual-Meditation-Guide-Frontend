import Banner from "../banner/Banner";
import "./Home.css";

const Home = ({
  setUserState,
  userState,
  setIsLoggedIn,
  isLoggedIn,
}: {
  setUserState: any;
  userState: any;
  setIsLoggedIn: any;
  isLoggedIn: boolean;
}) => {
  return (
    <div className="home-container">
      <Banner
        setIsLoggedIn={setIsLoggedIn}
        userState={userState}
        setUserState={setUserState}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
};

export default Home;
