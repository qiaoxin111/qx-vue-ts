<template>
  <div>
    <a-button v-if="!user.isLogin" type="primary" @click="login"
      >登录{{ user }}</a-button
    >
    <a-dropdown v-else>
      <a-button type="primary"> {{ user.name }} <DownOutlined /></a-button>
      <template #overlay>
        <a-menu>
          <a-menu-item>
            <a href="javascript:;" @click="logOut">登出</a>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { useStore } from "vuex";
import { UserProp } from "@/store/users";

export default defineComponent({
  name: "user-profile",
  props: {
    user: {
      type: Object as PropType<UserProp>,
      required: true,
    },
  },
  setup(props) {
    console.log(props.user);
    const store = useStore();
    const login = () => {
      store.commit("login");
    };
    const logOut = () => {
      store.commit("logout");
    };
    return {
      login,
      logOut,
    };
  },
});
</script>
