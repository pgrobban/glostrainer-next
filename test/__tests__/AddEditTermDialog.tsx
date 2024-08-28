import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import AddEditTermDialog from "@/components/AddEditTermDialog";
import utilClassInstances from "../../src/helpers/utilClassInstances";
const { localStorageHelperInstance } = utilClassInstances;

describe("AddEditTermDialog", () => {
  beforeEach(() => {
    localStorageHelperInstance.clearData();
  });

  it("Should not render anything if the dialog is not open", async () => {
    render(<AddEditTermDialog open={false} />);
    const addEditTermListDialogElement = screen.queryByTestId(
      "add-edit-term-list-dialog"
    );
    expect(addEditTermListDialogElement).toBeNull();
  });
});
