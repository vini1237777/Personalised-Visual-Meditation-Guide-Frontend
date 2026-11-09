import { waitForJob } from "./waitForJob";
import type { JobStatusResponse } from "../../../../services/config/userService.config";

const fast = { pollMs: 1, giveUpMs: 1000 };

const answers = (...steps: (JobStatusResponse | Error)[]) => {
  let i = 0;
  return jest.fn(async () => {
    const step = steps[Math.min(i++, steps.length - 1)];
    if (step instanceof Error) throw step;
    return step;
  });
};

const running: JobStatusResponse = { status: "running" };

test("keeps checking until the video is ready", async () => {
  const check = answers(
    { status: "queued" },
    running,
    { status: "done", videoUrl: "https://video" },
  );
  const job = await waitForJob("j1", check, fast);
  expect(job.videoUrl).toBe("https://video");
  expect(check).toHaveBeenCalledTimes(3);
  expect(check).toHaveBeenCalledWith("j1");
});

test("stops when the job failed", async () => {
  const check = answers(running, { status: "failed" });
  await expect(waitForJob("j1", check, fast)).rejects.toThrow(
    "Generation failed",
  );
  expect(check).toHaveBeenCalledTimes(2);
});

test("rides out a short network drop", async () => {
  const check = answers(new Error("offline"), new Error("offline"), {
    status: "done",
    videoUrl: "https://video",
  });
  const job = await waitForJob("j1", check, fast);
  expect(job.status).toBe("done");
});

test("stops after repeated failures", async () => {
  const check = answers(new Error("offline"));
  await expect(waitForJob("j1", check, fast)).rejects.toThrow("offline");
  expect(check).toHaveBeenCalledTimes(5);
});

test("gives up on a job that never finishes", async () => {
  const check = answers(running);
  await expect(
    waitForJob("j1", check, { pollMs: 1, giveUpMs: 20 }),
  ).rejects.toThrow("took too long");
});
