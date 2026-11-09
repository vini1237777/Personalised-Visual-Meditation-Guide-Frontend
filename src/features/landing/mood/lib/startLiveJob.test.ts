import { startLiveJob } from "./startLiveJob";

test("returns the job id when the job is accepted", async () => {
  const start = async () => ({ status: 202, data: { jobId: "j1" } });
  await expect(startLiveJob(start)).resolves.toBe("j1");
});

test("returns nothing when the account is not allowed", async () => {
  const start = async () => {
    throw Object.assign(new Error("Forbidden"), { status: 403 });
  };
  await expect(startLiveJob(start)).resolves.toBeNull();
});

test("returns nothing on any other status", async () => {
  const start = async () => ({ status: 200, data: { jobId: "j1" } });
  await expect(startLiveJob(start)).resolves.toBeNull();
});
