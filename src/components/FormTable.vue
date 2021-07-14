<template>
  <div>
    <div v-if="isLock">组件已经锁定，无法更改</div>
    <div v-else class="prop" v-for="(item, index) in formTableList" :key="index">
      <span class="name">{{ item.text }}</span>
      <component
        class="ele"
        :is="item.component"
        :[item.valueProp]="item.value"
        v-bind="item.extraProps"
        v-on="item.events"
        :isPage="isPage"
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
import ColorPicker from "@/components/ColorPicker.vue";
import QImage from "@/components/QImage.vue";
// import Upload from "@/components/upload/Upload.vue";
export default defineComponent({
  components: {
    ColorPicker,
    QImage,
  },
  props: {
    props: {
      type: Object,
      required: true,
    },
    isLock: {
      type: Boolean,
      required: true,
    },
    isPage: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["change"],
  setup(props, context) {
    const formTableList = computed(() => {
      console.log("组件", props);
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
              // a-input-number change事件返回值是number | string， a-inputchange事件返回值是event
              context.emit("change", {
                key,
                value: item.finalTransform ? item.finalTransform(e?.target?.value || e) : e?.target?.value || e,
              });
            },
          };
          datalist.push(item);
        }
      });
      console.log("datalist", datalist);
      return datalist;
    });
    console.log("formTableList", formTableList);
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
