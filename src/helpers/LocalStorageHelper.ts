"use client";
import { UUID } from "crypto";
import { v4 as uuid } from "uuid";
import { Profile, Quiz, QuizSaveModel, Term, TermList } from "./types";

const defaultProfile = {
  activeTermListId: null,
  termLists: [],
  lastSave: null,
  quizzes: [],
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
      if (!storedProfile.quizzes) {
        storedProfile.quizzes = [];
      }
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
    return this.cachedProfile.termLists || [];
  }

  getCachedQuizzes() {
    return this.cachedProfile.quizzes || [];
  }

  setActiveTermList(id: UUID | null) {
    this.cachedProfile.activeTermListId = id;
    this.saveData();
  }

  deleteTermList(id: UUID) {
    this.cachedProfile.termLists = this.cachedProfile.termLists.filter(
      (termList) => termList.id !== id
    );
    this.saveData();
  }

  renameTermList(id: UUID, newName: string) {
    const list = this.getTermListById(id);
    if (!list) {
      return;
    }
    list.name = newName;
    this.saveData();
    return list; // todo: better
  }

  getTermListById(id: UUID) {
    return this.cachedProfile.termLists.find((list) => list.id === id);
  }

  getQuizById(id: UUID) {
    return this.cachedProfile.quizzes.find((quiz) => quiz.id === id);
  }

  getTermListByName(name: string) {
    return this.cachedProfile.termLists.find((list) => list.name === name);
  }

  getQuizByName(name: string) {
    return this.cachedProfile.quizzes.find((list) => list.name === name);
  }

  overwriteTermLists(termLists: TermList[]) {
    this.cachedProfile.termLists = JSON.parse(JSON.stringify(termLists));
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
    this.cachedProfile = JSON.parse(JSON.stringify(defaultProfile));
  }

  updateActiveTermList(newTerms: Term[]) {
    const termList = this.getActiveTermList();
    if (!termList) {
      throw new Error();
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

  createNewQuiz({ name, termListsWithCards, order }: QuizSaveModel) {
    const newQuiz: Quiz = {
      id: uuid() as UUID,
      name,
      createdOn: new Date(),
      termListsWithCards,
      order,
    };
    this.cachedProfile.quizzes.push(newQuiz);
    return newQuiz;
  }

  updateQuiz(editingQuizId: UUID, quizSaveModel: QuizSaveModel) {
    const { name, termListsWithCards, order } = quizSaveModel;
    const quizIndex = this.cachedProfile.quizzes.findIndex(
      (quiz) => quiz.id === editingQuizId
    );
    if (quizIndex === -1) {
      throw new Error();
    }
    this.cachedProfile.quizzes[quizIndex] = {
      id: editingQuizId,
      name,
      createdOn: this.cachedProfile.quizzes[quizIndex].createdOn,
      updatedOn: new Date(),
      termListsWithCards,
      order,
    };
  }

  deleteQuiz(id: UUID) {
    this.cachedProfile.quizzes = this.cachedProfile.quizzes.filter(
      (quiz) => quiz.id !== id
    );
    this.saveData();
  }
}
