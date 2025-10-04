import axios from "axios";

export async function handleDownloadAndSetVideo(videoUrlFromGemini: string) {
  try {
    const response = await axios.post("http://localhost:4000/api/download", {
      videoUrl: videoUrlFromGemini,
    });

    // The response.data.videoDownloadUrl will be: http://localhost:4000/assets/videos/1700000000_clipname.mp4
    const staticVideoUrl = response.data.videoDownloadUrl;

    return staticVideoUrl;

    // Pass this final static URL to your MeditationPage component's prop
    // e.g., setMeditationContent(staticVideoUrl);
  } catch (error) {
    console.error("Download failed:", error);
  }
}
