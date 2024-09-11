import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "../../src/app/ResponsiveAppBar";

describe("Page", () => {
  it("renders a heading", () => {
    render(<Page />);
    const heading = screen.getByText("Robban's GlosTrainer");
    expect(heading).toBeVisible();
  });
});
