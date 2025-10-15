import axios from "axios";

export async function handleDownloadAndSetVideo(videoUrlFromGemini: string) {
  try {
    const response = await axios.post("http://localhost:4000/api/download", {
      videoUrl: videoUrlFromGemini,
    });

    const staticVideoUrl = response.data.videoDownloadUrl;

    return staticVideoUrl;
  } catch (error) {
    console.error("Download failed:", error);
  }
}
