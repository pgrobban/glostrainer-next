import utilClassInstances from "../helpers/utilClassInstances";
import { ImportStrategy, Term, TermList } from "./types";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
const { localStorageHelperInstance } = utilClassInstances;

const universalBOM = "\uFEFF"; // needed for Excel to parse files as UTF-8

const exportBlob = (blob: Blob, fileName: string) => {
  const element = document.createElement("a");
  element.href = URL.createObjectURL(blob);
  element.download = fileName;
  document.body.appendChild(element);
  element.click();
};

export const exportJson = () => {
  const termLists = localStorageHelperInstance.getCachedTermLists();
  const stringifiedLists = JSON.stringify(termLists);
  const blob = new Blob([stringifiedLists], {
    type: "application/json; charset=utf-8",
  });
  exportBlob(blob, "lists.json");
};

export const exportCsv = () => {
  const termLists = localStorageHelperInstance.getCachedTermLists();
  const terms = termLists.map((termList) => termList.terms).flat();
  const fields: (keyof Term)[] = ["swedish", "definition", "type", "notes"];
  const replacer = (_: string, value: any) => (value === null ? "" : value);

  const csv = [
    fields.map((field) => field.toUpperCase()).join(","),
    ...terms.map((term) =>
      fields
        .map((fieldName) => JSON.stringify(term[fieldName], replacer))
        .join(",")
    ),
  ].join("\r\n");

  const blob = new Blob([universalBOM + csv], {
    type: "text/csv; charset=utf-8",
  });
  exportBlob(blob, "lists.csv");
};

export const exportXlsx = () => {
  const termLists = localStorageHelperInstance.getCachedTermLists();
  const workbook = XLSX.utils.book_new();
  const fields: (keyof Term)[] = ["swedish", "definition", "type", "notes"];

  termLists.forEach((termList) => {
    const modifiedTerms = termList.terms.map((term) => ({
      Swedish: term.swedish,
      Definition: term.definition,
      "Word class": term.type,
      Notes: term.notes,
    }));

    workbook.SheetNames.push(termList.name);
    workbook.Sheets[termList.name] = XLSX.utils.json_to_sheet(modifiedTerms);
    workbook.Sheets[termList.name]["!cols"] = [
      // column widths
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
    ];
    workbook.Sheets[termList.name]["!autofilter"] = { ref: "A1:D1" };
  });
  const buffer = XLSX.writeXLSX(workbook, { type: "buffer" });
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8",
  });
  exportBlob(blob, "lists.xlsx");
};

export const exportPdf = async () => {
  const termLists = localStorageHelperInstance.getCachedTermLists();

  const doc = new jsPDF();
  termLists.forEach((termList, index) => {
    if (index > 0) {
      doc.addPage();
    }
    const xOffset =
      doc.internal.pageSize.width / 2 -
      // @ts-expect-error Property 'getFontSize' does not exist on type
      (doc.getStringUnitWidth(termList.name) * doc.internal.getFontSize()) / 2;
    doc.text(termList.name, xOffset, 10, { align: "center" });
    autoTable(doc, {
      head: [["Swedish", "Definition", "Word class", "Notes"]],
      body: termList.terms.map((term) => [
        term.swedish,
        term.definition,
        term.type,
        term.notes || "",
      ]),
    });
  });

  doc.save("lists.pdf");
};

export const tryGetTermListsFromFile = (inputFile: File) => {
  return new Promise<TermList[]>(async (resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsText(inputFile, "utf-8");
    fileReader.onloadend = () => {
      const result = fileReader.result;
      if (typeof result !== "string") {
        return reject();
      }

      const parsed = JSON.parse(result);
      // TODO: validate data
      return resolve(parsed);
    };
  });
};

const mergeLists = (termListsFromImport: TermList[], overwrite: boolean) => {
  const cachedLists = localStorageHelperInstance.getCachedTermLists();
  const result = [...cachedLists];
  termListsFromImport.forEach((termListFromImport) => {
    const termListExists = cachedLists.some(
      (list) => list.name === termListFromImport.name
    ); // maybe better to check id but names should be unique as well
    if (termListExists) {
      const listInResult = result.find(
        (list) => list.name === termListFromImport.name
      );
      if (!listInResult) {
        return; // should not happen, only to appease TS
      }
      const mergedList = { ...listInResult };
      mergedList.terms = [];
      termListFromImport.terms.forEach((termFromImport) => {
        const foundTermInCachedList = listInResult.terms.find(
          (resultTerm) =>
            resultTerm.swedish === termFromImport.swedish &&
            resultTerm.definition === termFromImport.definition
        );
        if (foundTermInCachedList) {
          mergedList.terms.push(
            overwrite ? termFromImport : foundTermInCachedList
          );
        } else {
          mergedList.terms.push(termFromImport);
        }
      });
      mergedList.updatedOn = new Date();
    } else {
      result.push(termListFromImport);
    }
  });
  return result;
};

export const importData = (
  termListsFromImport: TermList[],
  importStrategy: ImportStrategy
): TermList[] => {
  switch (importStrategy) {
    case "merge_lists_with_overwrite": {
      return mergeLists(termListsFromImport, true);
    }
    case "merge_lists_without_overwrite": {
      return mergeLists(termListsFromImport, false);
    }
    case "only_add_new_lists": {
      const cachedLists = localStorageHelperInstance.getCachedTermLists();
      const result = [...cachedLists];
      termListsFromImport.forEach((termListFromImport) => {
        const termListExists = cachedLists.some(
          (list) => list.name === termListFromImport.name
        );
        if (!termListExists) {
          result.push(termListFromImport);
        }
      });
      return result;
    }
    case "clear_and_import":
      return termListsFromImport;
  }
};
