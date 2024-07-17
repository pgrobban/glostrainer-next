import { TermList } from "./types";

export default class LocalStorageHelper {
  private cachedTermLists: TermList[] = [];
  static LOCAL_STORAGE_KEY = "termLists";

  loadData() {
    const localData =
      localStorage.getItem(LocalStorageHelper.LOCAL_STORAGE_KEY) || "[]";
    const cachedTermLists = JSON.parse(localData) as TermList[];
    this.cachedTermLists = cachedTermLists;
    return cachedTermLists;
  }

  getCachedTermLists() {
    return this.cachedTermLists;
  }

  saveData(termLists: TermList[]) {
    this.cachedTermLists = termLists;
    localStorage.setItem(
      LocalStorageHelper.LOCAL_STORAGE_KEY,
      JSON.stringify(termLists)
    );
  }
}
