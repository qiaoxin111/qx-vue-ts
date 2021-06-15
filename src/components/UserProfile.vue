<template>
  <div>
    <a-button v-if="!user.isLogin" type="primary" @click="login">登录111{{ user }}</a-button>
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
import { useRouter } from "vue-router";
import { UserProp } from "@/store/users";

export default defineComponent({
  name: "user-profile",
  props: {
    user: {
      type: Object as PropType<UserProp>,
      required: true,
    },
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const login = () => {
      store.commit("login");
      router.push({ path: "/editor" });
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
