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
      <div className="home">
        <Banner
          setIsLoggedIn={setIsLoggedIn}
          userState={userState}
          setUserState={setUserState}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  );
};

export default Home;
