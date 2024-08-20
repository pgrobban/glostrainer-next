import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import AddEditTermListDialog from "../../src/components/AddEditTermListDialog";
import { MINIMUM_TERM_LIST_NAME_LENGTH } from "@/components/AddEditTermListDialog";
import "../mocks/LocalStorageMock";
import LocalStorageHelper from "@/helpers/LocalStorageHelper";
import profileWithOneEmptyList from "../data/profileWithOneEmptyList";

describe("AddEditTermListDialog", () => {
  it("Should not render anything if the dialog is not open", async () => {
    render(
      <AddEditTermListDialog
        mode="add"
        editingTermListId={null}
        open={false}
        onSave={() => {}}
        onClose={() => {}}
      />
    );
    const addEditTermListDialogElement = screen.queryByTestId(
      "add-edit-term-list-dialog"
    );
    expect(addEditTermListDialogElement).toBeNull();
  });

  it("Validates creation of a new term list", async () => {
    const user = userEvent.setup();
    const saveMock = jest.fn();

    render(
      <AddEditTermListDialog
        open={true}
        editingTermListId={null}
        mode={"add"}
        onSave={saveMock}
        onClose={() => {}}
      />
    );
    const termListNameTextField = screen
      .getByTestId("term-list-name")
      .querySelector("input");
    if (!termListNameTextField) {
      throw new Error("Term list name text field was not found");
    }
    expect(termListNameTextField).toHaveFocus();

    const saveElement = screen.getByText("Save");
    await user.click(saveElement);
    let warningElement = screen.getByText(
      `Please enter at least ${MINIMUM_TERM_LIST_NAME_LENGTH} characters.`
    );
    expect(warningElement).toBeVisible();
    await user.keyboard("X");
    await user.click(saveElement);
    warningElement = screen.getByText(
      `Please enter at least ${MINIMUM_TERM_LIST_NAME_LENGTH} characters.`
    );
    expect(warningElement).toBeVisible();
    expect(saveMock).not.toHaveBeenCalled();

    await user.click(termListNameTextField);
    await user.keyboard("[Backspace]");
    await user.keyboard("My term list");

    await user.click(saveElement);
    expect(warningElement).not.toBeVisible();
    expect(saveMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "My term list",
      })
    );
  });

  it("Validates editing of an existing list", async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      LocalStorageHelper.LOCAL_STORAGE_KEY,
      JSON.stringify(profileWithOneEmptyList)
    );

    const saveMock = jest.fn();
    await waitFor(() => {
      render(
        <AddEditTermListDialog
          open={true}
          editingTermListId={profileWithOneEmptyList.termLists[0].id}
          mode={"edit"}
          onSave={saveMock}
          onClose={() => {}}
        />
      );
    });
    const termListNameTextField = screen
      .getByTestId("term-list-name")
      .querySelector("input");

    expect(termListNameTextField).toHaveFocus();
  });
});
