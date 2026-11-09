import type { JobStatusResponse } from "../../../../services/config/userService.config";

const POLL_MS = 5000;
// The worker stops at 15 minutes, so a job past this is not going to finish.
const GIVE_UP_MS = 16 * 60 * 1000;
// A dropped connection should not end a job that is still running on the server.
const MAX_FAILED_CHECKS = 5;

type Check = (jobId: string) => Promise<JobStatusResponse>;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function waitForJob(
  jobId: string,
  check: Check,
  {
    pollMs = POLL_MS,
    giveUpMs = GIVE_UP_MS,
    isStopped = () => false,
  }: { pollMs?: number; giveUpMs?: number; isStopped?: () => boolean } = {},
): Promise<JobStatusResponse> {
  const deadline = Date.now() + giveUpMs;
  let failedChecks = 0;

  while (Date.now() < deadline) {
    await wait(pollMs);
    if (isStopped()) throw new Error("Stopped waiting");

    let job: JobStatusResponse;
    try {
      job = await check(jobId);
    } catch (err) {
      failedChecks += 1;
      if (failedChecks >= MAX_FAILED_CHECKS) throw err;
      continue;
    }

    failedChecks = 0;
    if (job.status === "done") return job;
    if (job.status === "failed") throw new Error("Generation failed");
  }

  throw new Error("Generation took too long");
}
