<template>
  <div>
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
      <Upload v-if="item.isPic" :onSuccess="onSuccess" :showFileList="false"></Upload>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import { PropsFormType, propsForm, PropFormValueType } from "@/propsMap";
import ColorPicker from "@/components/ColorPicker.vue";
import Upload from "@/components/upload/Upload.vue";
export default defineComponent({
  components: {
    ColorPicker,
    Upload,
  },
  props: {
    props: {
      type: Object,
      required: true,
    },
  },
  emits: ["change"],
  setup(props, context) {
    // const formTableList = ref<PropFormValueType[]>([]);
    // watch(
    //   () => props.props,
    //    (props) => {
    //     console.log("ppppppp", props);
    //     // const datalist = [] as PropFormValueType[];
    //     Object.entries(props).forEach(([key, value]) => {
    //       const newKey = key as keyof PropsFormType;
    //       const item = propsForm[newKey];
    //       if (item) {
    //         if (key === "src") {
    //           item.isPic = true;
    //         }
    //         item.value = item.initialTranform ? item.initialTranform(value) : value;
    //         item.valueProp = item.valueProp ? item.valueProp : "value";
    //         item.eventName = item.eventName ? item.eventName : "change";
    //         item.events = {
    //           [item.eventName]: (e: any) => {
    //             console.log("调用change方法", e.target.value);
    //             context.emit("change", {
    //               key,
    //               value: item.finalTransform ? item.finalTransform(e?.target?.value || e) : e?.target?.value || e,
    //             });
    //           },
    //         };
    //         console.log("item", item);
    //         formTableList.value.push(cloneDeep(item));
    //         // datalist.push(item);
    //         // return item;
    //       }
    //     });
    //     // formTableList.value = datalist;
    //   },
    //   {
    //     immediate: true,
    //     deep: true,
    //   }
    // );
    const formTableList = computed(() => {
      const datalist = [] as PropFormValueType[];
      Object.entries(props.props).forEach(([key, value]) => {
        const newKey = key as keyof PropsFormType;
        const item = propsForm[newKey];
        if (item) {
          if (key === "src") {
            item.isPic = true;
          }
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
      return datalist;
    });
    console.log("formTableList", formTableList);
    const onSuccess = (res: any) => {
      const url = res.data.url;
      const srcItem = formTableList.value.find((item) => item.isPic);
      if (srcItem) {
        console.log("srcInte", srcItem);
        console.log("url", url);
        console.log("value", srcItem.value);
        srcItem.value = url;
        context.emit("change", { key: "src", value: url });
      }
      console.log("formTableList", formTableList);
    };
    return {
      formTableList,
      onSuccess,
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
