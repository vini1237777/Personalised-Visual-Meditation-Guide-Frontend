import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      {
        <p style={{ color: "black" }}>
          <span
            style={{
              marginTop: 16,
              textAlign: "center",
              color: "whitesmoke",
              display: "flex",
            }}
          >
            <p>
              🌸 While we generate your personalized video, try this:
              <br />
              <br />
              Take a slow deep breath in… and gently exhale.
              <br />
              <br />
              Your calm is on the way.
              <br />
              <br />
              Loading...
            </p>
          </span>
        </p>
      }
    </div>
  );
};

export default Loader;
