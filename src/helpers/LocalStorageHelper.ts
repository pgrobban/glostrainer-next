"use client";
import { UUID } from "crypto";
import { v4 as uuid } from "uuid";
import {
  ContentToGenerate,
  Profile,
  Quiz,
  QuizCard,
  Term,
  TermList,
} from "./types";
import { QuizSaveModel } from "@/components/AddEditQuizDialog";
import { TermSaveModel } from "@/components/AddEditTermDialog";

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
      storedProfile.termLists.forEach((termList) => {
        termList.terms.forEach((term) => {
          if (!term.id) {
            term.id = uuid() as UUID;
          }
        });
      });
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

  addTerm(termSaveModel: TermSaveModel) {
    const termList = this.getActiveTermList();
    if (!termList) {
      return;
    }
    termList.terms.push({ id: uuid() as UUID, ...termSaveModel });
    this.saveData();
  }

  updateTerm(termId: UUID, termSaveModel: TermSaveModel) {
    const termList = this.getActiveTermList();
    if (!termList) {
      return;
    }

    const termIndex = termList.terms.findIndex((term) => term.id === termId);
    termList.terms.splice(termIndex, 1, { id: termId, ...termSaveModel });
    this.saveData();
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

  overwriteQuizzes(quizzes: Quiz[]) {
    this.cachedProfile.quizzes = JSON.parse(JSON.stringify(quizzes));
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

  createNewQuiz({ name, cards, order }: QuizSaveModel) {
    const newQuiz: Quiz = {
      id: uuid() as UUID,
      name,
      createdOn: new Date(),
      cards,
      order,
    };
    this.cachedProfile.quizzes.push(newQuiz);
    return newQuiz;
  }

  createQuizCard(
    termListId: UUID,
    termId: UUID,
    contentToGenerate: ContentToGenerate
  ) {
    const quizCard: QuizCard = {
      id: uuid() as UUID,
      termListId,
      termId,
      contentToGenerate,
    };
    return quizCard;
  }

  updateQuiz(editingQuizId: UUID, quizSaveModel: QuizSaveModel) {
    const { name, cards, order } = quizSaveModel;
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
      cards,
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
