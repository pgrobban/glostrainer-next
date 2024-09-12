import { Profile } from "@/helpers/types";

const userProfile: Profile = {
  termLists: [
    {
      id: "some-list-123-456-789",
      name: "My term list",
      createdOn: new Date(),
      terms: [],
    },
  ],
  activeTermListId: null,
  quizzes: [],
};

export default userProfile;
