<template>
  <div>
    <!-- <a-input placeholder="Basic usage" value="111" @change="changeValue" /> -->

    <div class="prop" v-for="(item, index) in formTableList" :key="index">
      <span class="name">{{ item.text }}</span>
      <component
        class="ele"
        :is="item.component"
        :[item.valueProp]="item.value"
        v-bind="item.extraProps"
        v-on="item.events"
      >
        <template v-if="item.options">
          <component v-for="(subItem, i) in item.options" :is="item.subComponent" :key="i" :value="subItem.value">
            {{ subItem.text }}
          </component>
        </template>
      </component>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import { PropsFormType, propsForm, PropFormValueType } from "@/propsMap";
export default defineComponent({
  props: {
    props: {
      type: Object,
      required: true,
    },
  },
  emits: ["change"],
  setup(props, context) {
    const formTableList = computed(() => {
      const datalist = [] as PropFormValueType[];
      Object.entries(props.props).forEach(([key, value]) => {
        const newKey = key as keyof PropsFormType;
        const item = propsForm[newKey];
        if (item) {
          item.value = item.initialTranform ? item.initialTranform(value) : value;
          item.valueProp = item.valueProp ? item.valueProp : "value";
          item.eventName = item.eventName ? item.eventName : "change";
          item.events = {
            [item.eventName]: (e: any) => {
              context.emit("change", {
                key,
                value: item.finalTransform ? item.finalTransform(e?.target?.value || e) : e?.target?.value || e,
              });
            },
          };
          datalist.push(item);
        }
      });
      return datalist;
    });
    const handleChange = (e: any) => {
      console.log("value", e);
    };
    return {
      handleChange,
      formTableList,
    };
  },
});
</script>
<style lang="less">
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
