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
            <div>
              🌸 While we generate your personalized video using Generative API,
              try this:
              <br />
              <br />
              Take a slow deep breath in… and gently exhale.
              <br />
              <br />
              Your calm is on the way.
              <br />
              <br />
              Loading...
            </div>
          </span>
        </p>
      }
    </div>
  );
};

export default Loader;
