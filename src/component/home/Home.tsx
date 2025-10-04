import Banner from "../banner/Banner";
import "./Home.css";

const Home = ({
  setUserState,
  userState,
  setIsLoggedIn,
}: {
  setUserState: any;
  userState: any;
  setIsLoggedIn: any;
}) => {
  return (
    <div className="home-container">
      <div className="home">
        <Banner
          setIsLoggedIn={setIsLoggedIn}
          userState={userState}
          setUserState={setUserState}
        />
      </div>
    </div>
  );
};

export default Home;
