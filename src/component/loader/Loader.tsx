import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      {<p style={{ color: "black" }}>Loading...</p>}
    </div>
  );
};

export default Loader;
