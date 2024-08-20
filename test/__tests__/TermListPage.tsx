import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import TermListsPage from "../../src/app/TermListsPage";

describe("Page", () => {
  it("Renders the UI without any lists", () => {
    render(<TermListsPage />);
    let element;
    element = screen.getByText("My term lists");
    expect(element).toBeVisible();
    element = screen.getByPlaceholderText("Search");
    expect(element).toBeVisible();
    element = screen.queryByText("Name");
    expect(element).not.toBeInTheDocument();
    element = screen.queryByText("Items");
    expect(element).not.toBeInTheDocument();
    element = screen.queryByText("Last update");
    expect(element).not.toBeInTheDocument();
    element = screen.getByText("You haven't created any lists yet.");
    expect(element).toBeVisible();
    element = screen.getByText("Create term list");
    expect(element).toBeVisible();
  });

  it("Should be possible to create a new term list", async () => {
    const user = userEvent.setup();
    render(<TermListsPage />);
    const createTermListButton = screen.getByText("Create term list");
    await waitFor(async () => createTermListButton.click());
    const termListNameTextField = screen
      .getByTestId("term-list-name")
      .querySelector("input");
    expect(termListNameTextField).toHaveFocus();
    await user.keyboard("My term list");

    const saveElement = screen.getByText("Save");
    await user.click(saveElement);

    expect(termListNameTextField).not.toBeVisible();
    const myTermListElement = screen.getByText("My term list");
    expect(myTermListElement).toBeVisible();
  });
});
