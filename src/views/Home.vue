<template>
  <div class="home">
    <a-layout>
      <a-layout-header><UserProfile :user="user"></UserProfile> </a-layout-header>
      <a-layout-content>
        <TempleteList :list="testData" />
      </a-layout-content>
      <a-layout-footer>Footer</a-layout-footer>
    </a-layout>
  </div>
</template>

<script lang="ts">
// import { mapValues, pick } from "lodash";
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { GlobalDataProps } from "../store/index";
import TempleteList from "@/components/TempleteList.vue";
import UserProfile from "@/components/UserProfile.vue";

export default defineComponent({
  name: "Home",
  components: {
    TempleteList,
    UserProfile,
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    console.log(store);
    const testData = computed(() => store.state.templates);
    const user = computed(() => store.state.user);
    console.log("user", user);
    console.log("testData");
    return {
      testData,
      user,
    };
  },
});
</script>
