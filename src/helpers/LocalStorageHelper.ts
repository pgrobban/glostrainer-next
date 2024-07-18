import { AssertionError } from "assert";
import { Profile, Term } from "./types";

const defaultProfile = {
  activeTermListId: null,
  termLists: [],
  lastSave: null,
};

export default class LocalStorageHelper {
  private cachedProfile: Profile = { ...defaultProfile };
  static LOCAL_STORAGE_KEY = "glosTrainerProfile";

  constructor() {
    this.loadData();
  }

  loadData() {
    const localData = localStorage.getItem(
      LocalStorageHelper.LOCAL_STORAGE_KEY
    );
    if (localData) {
      const storedProfile = JSON.parse(localData) as Profile;
      this.cachedProfile = storedProfile;
    }
  }

  getActiveTermListId() {
    return this.cachedProfile.activeTermListId;
  }

  getActiveTermList() {
    return this.cachedProfile.termLists.find(
      (termList) => termList.id === this.getActiveTermListId()
    );
  }

  getCachedTermLists() {
    return this.cachedProfile.termLists;
  }

  setActiveTermList(id: string) {
    this.cachedProfile.activeTermListId = id;
  }

  saveData() {
    this.cachedProfile.lastSave = new Date();
    localStorage.setItem(
      LocalStorageHelper.LOCAL_STORAGE_KEY,
      JSON.stringify(this.cachedProfile)
    );
  }

  clearData() {
    localStorage.removeItem(LocalStorageHelper.LOCAL_STORAGE_KEY);
    window.location.reload();
  }

  updateActiveTermList(newTerms: Term[]) {
    const termList = this.getActiveTermList();
    if (!termList) {
      throw new AssertionError();
    }
    termList.terms = newTerms;
    termList.updatedOn = new Date();
  }

  getLastSaveDate() {
    return this.cachedProfile.lastSave;
  }
}
