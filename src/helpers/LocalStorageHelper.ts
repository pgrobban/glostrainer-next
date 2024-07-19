"use client";
import { AssertionError } from "assert";
import { Profile, Term, TermList } from "./types";
import { v4 as uuid } from "uuid";
import { UUID } from "crypto";

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
    if (!global.window) {
      return;
    }
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

  setActiveTermList(id: UUID) {
    this.cachedProfile.activeTermListId = id;
    this.saveData();
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
    this.cachedProfile = { ...defaultProfile };
  }

  updateActiveTermList(newTerms: Term[]) {
    const termList = this.getActiveTermList();
    if (!termList) {
      throw new AssertionError();
    }
    termList.terms = newTerms;
    termList.updatedOn = new Date();
    this.saveData();
  }

  getLastSaveDate() {
    return this.cachedProfile.lastSave;
  }

  createNewTermList(name: string) {
    const newTermList: TermList = {
      id: uuid() as UUID,
      name,
      createdOn: new Date(),
      terms: [],
    };
    this.cachedProfile.termLists.push(newTermList);
    this.setActiveTermList(newTermList.id);
    return newTermList;
  }
}
