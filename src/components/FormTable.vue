<template>
  <div>
    <div class="prop" v-for="(item, index) in formTableList" :key="index">
      <span class="name">{{ item.text }}</span>
      <component class="ele" :is="item.component" :value="item.value" v-bind="item.extraProps"></component>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { PropsFormType, propsForm } from "@/propsMap";
// import { defaultPropsType } from "@/defaultProps";
// import { reduce } from "lodash-es";
export default defineComponent({
  props: {
    props: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const formTableList = [] as any;
    Object.entries(props.props).forEach(([key, value]) => {
      const newKey = key as keyof PropsFormType;
      const item = propsForm[newKey];
      if (item) {
        item.value = item.initialTransform ? item.initialTransform(value) : value;
        formTableList.push(item);
      }
    });
    return {
      formTableList,
    };
  },
});
</script>
<style lang="less" scoped>
.prop {
  display: flex;
  margin-bottom: 10px;
  .name {
    width: 30%;
    text-align: center;
  }
  .ele {
    width: 70%;
  }
}
</style>
