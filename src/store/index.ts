import { createStore } from "vuex";
export interface UserProps {
  isLogin: boolean;
}
export interface TemplateProps {
  id: string;
  coverImage: string;
}
export interface GlobalDataProps {
  templates: TemplateProps[];
  user: UserProps;
}
const testData = [
  { id: "1", coverImage: "" },
  { id: "1", coverImage: "" },
];
const user = { isLogin: false };
const store = createStore<GlobalDataProps>({
  state: {
    templates: testData,
    user: user,
  },
});

export default store;
