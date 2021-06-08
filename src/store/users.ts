import { Module } from "vuex";
import { GlobalDataProps } from "./index";
export interface UserProp {
  isLogin: boolean;
  name?: string;
}

const userInfo: UserProp = { isLogin: false };

const user: Module<UserProp, GlobalDataProps> = {
  state: userInfo,
  mutations: {
    login(state) {
      state.isLogin = true;
      state.name = "hahahah";
    },
    logout(state) {
      state.isLogin = false;
      state.name = "";
    },
  },
};
export default user;
