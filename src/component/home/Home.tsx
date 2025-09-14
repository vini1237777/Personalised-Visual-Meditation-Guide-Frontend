import Banner from "../banner/Banner";
import "./Home.css";

const Home = ({
  setUserState,
  userState,
}: {
  setUserState: any;
  userState: any;
}) => {
  return (
    <div className="home-container">
      <div className="home">
        <Banner userState={userState} setUserState={setUserState} />
      </div>
    </div>
  );
};

export default Home;
