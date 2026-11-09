type StartResponse = { status: number; data: { jobId: string } };

// Anything but an accepted job, a refusal or a network error alike, means the demo.
export async function startLiveJob(
  start: () => Promise<StartResponse>,
): Promise<string | null> {
  try {
    const response = await start();
    return response.status === 202 ? response.data.jobId : null;
  } catch {
    return null;
  }
}
