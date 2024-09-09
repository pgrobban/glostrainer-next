import AddEditTermDialog from "@/components/AddEditTermDialog";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  within,
  getByRole,
} from "@testing-library/react";
import utilClassInstances from "../../src/helpers/utilClassInstances";
import userEvent from "@testing-library/user-event";
import { Term } from "@/helpers/types";
const { localStorageHelperInstance } = utilClassInstances;

describe("AddEditTermDialog", () => {
  beforeEach(() => {
    localStorageHelperInstance.clearData();
  });

  it("Should not render anything if the dialog is not open", async () => {
    render(
      <AddEditTermDialog open={false} onClose={() => {}} onSave={() => {}} />
    );
    const addEditTermListDialogElement = screen.queryByTestId(
      "add-edit-term-list-dialog"
    );
    expect(addEditTermListDialogElement).toBeNull();
  });

  it("Validates creation of a new term", async () => {
    const user = userEvent.setup();
    const mockSave = jest.fn();

    render(
      <AddEditTermDialog
        addingToListName="My term list"
        open={true}
        onClose={() => {}}
        onSave={mockSave}
      />
    );
    const addEditTermListDialogElement = screen.queryByTestId(
      "add-edit-term-dialog"
    );
    expect(addEditTermListDialogElement).toBeVisible();
    const titleElement = screen.getByText(
      `Add new term to list 'My term list'`
    );
    expect(titleElement).toBeVisible();

    const saveElement = screen.getByText("Save");
    expect(saveElement).toBeDisabled();

    const swedishTextField = screen
      .getByTestId("term-swedish")
      .querySelector("input");
    if (!swedishTextField) {
      throw new Error("Swedish text field was not found");
    }

    expect(swedishTextField).toBeVisible();
    expect(swedishTextField).toHaveFocus();
    user.keyboard("My term");
    expect(saveElement.closest("button")).toBeDisabled();
    expect(mockSave).not.toHaveBeenCalled();

    const definitionElement = screen.getByText("Definition");
    expect(definitionElement).toBeVisible();
    user.click(definitionElement);
    user.keyboard("My definition");
    expect(saveElement.closest("button")).toBeDisabled();
    expect(mockSave).not.toHaveBeenCalled();

    const wordClassElement = await screen.getByLabelText("Word class");
    user.click(wordClassElement);
    user.click(screen.getByText("Noun"));

    expect(saveElement.closest("button")).not.toBeDisabled();
    user.click(saveElement);
    expect(mockSave).toHaveBeenCalledWith<Term[]>({
      swedish: "My term list",
      definition: "My definition",
      type: "Noun",
    });
  });
});
