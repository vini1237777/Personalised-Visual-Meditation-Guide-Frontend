import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CtaButton, FeelingChip, StepBar } from ".";

test("step bar marks the current step and keeps every label for screen readers", () => {
  render(<StepBar current={2} />);
  const steps = screen.getAllByRole("listitem");
  expect(steps).toHaveLength(4);
  expect(steps[2]).toHaveAttribute("aria-current", "step");
  expect(steps[0]).toHaveAttribute("data-state", "done");
  expect(steps[3]).toHaveAttribute("data-state", "next");
  expect(screen.getByText("Check out")).toBeInTheDocument();
});

test("feeling chip reports its pressed state and calls back on click", () => {
  const onClick = jest.fn();
  render(<FeelingChip label="Afraid" dot="#a77fd0" selected={false} onClick={onClick} />);
  const chip = screen.getByRole("button", { name: "Afraid" });
  expect(chip).toHaveAttribute("aria-pressed", "false");
  userEvent.click(chip);
  expect(onClick).toHaveBeenCalledTimes(1);
});

test("call to action button is a plain button by default", () => {
  render(<CtaButton>Start a session</CtaButton>);
  expect(screen.getByRole("button", { name: "Start a session" })).toHaveAttribute("type", "button");
});
