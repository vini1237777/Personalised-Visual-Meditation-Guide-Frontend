import { savePendingFeeling, takePendingFeeling } from "./pendingFeeling";

beforeEach(() => sessionStorage.clear());

test("hands the picked feeling over once", () => {
  savePendingFeeling("😨");
  expect(takePendingFeeling()).toBe("😨");
  expect(takePendingFeeling()).toBeNull();
});

test("ignores values that are not a known feeling", () => {
  sessionStorage.setItem("soulsync.pendingFeeling", "nope");
  expect(takePendingFeeling()).toBeNull();
});

test("saving nothing clears an earlier pick", () => {
  savePendingFeeling("😀");
  savePendingFeeling(null);
  expect(takePendingFeeling()).toBeNull();
});
