import { render, screen, waitFor } from "@testing-library/react";
import VisitorCount from "./VisitorCount";
import makeRequest from "../../../api/makeRequest";

jest.mock("../../../api/makeRequest", () => ({
  __esModule: true,
  default: jest.fn(),
}));
const mocked = makeRequest as jest.Mock;

test("shows the count from the API", async () => {
  mocked.mockResolvedValue({ data: { visitors: 1250 } });
  render(<VisitorCount />);
  expect(await screen.findByText("1,250 visitors")).toBeInTheDocument();
});

test("uses the singular for one visitor", async () => {
  mocked.mockResolvedValue({ data: { visitors: 1 } });
  render(<VisitorCount />);
  expect(await screen.findByText("1 visitor")).toBeInTheDocument();
});

test("shows nothing when the API fails", async () => {
  mocked.mockRejectedValue(new Error("offline"));
  const { container } = render(<VisitorCount />);
  await waitFor(() => expect(mocked).toHaveBeenCalled());
  expect(container).toBeEmptyDOMElement();
});
