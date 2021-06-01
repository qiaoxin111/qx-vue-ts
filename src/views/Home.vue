<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    <!-- <div v-for='item in testData' :key='item.id'>{{item.}}</div> -->
  </div>
</template>

<script lang="ts">
// import { mapValues, pick } from "lodash";
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { GlobalDataProps } from "../store/index";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

export default defineComponent({
  name: "Home",
  components: {
    HelloWorld,
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    console.log(store);
    const testData = computed(() => store.state.templates);
    console.log("testData", testData);
    return {
      testData,
    };
  },
});
</script>
