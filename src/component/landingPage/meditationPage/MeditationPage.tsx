import "./MeditationPage.css";

function MeditationPage(meditationContent: any) {
  return (
    <div className="meditation-page">
      <h2>Your Relaxing Guide</h2>
      <video width="640" height="360" controls>
        <source
          src={`${meditationContent?.meditationContent?.videoUrl}`}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default MeditationPage;
