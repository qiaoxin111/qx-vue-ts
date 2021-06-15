<template>
  <div class="colorPickerCom">
    <div class="nativeColorPicker">
      <input type="color" :value="value" @input="handleChange($event.target.value)" />
    </div>
    <ul class="colorPickerContainer">
      <li v-for="(item, index) in colorArray" :key="index">
        <div class="colorInner" :style="{ backgroundColor: item }" @click="handleChange(item)"></div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
const colorArray = ["#fff", "#d02d35", "#dc4a2d", "#f2dc52", "#78d047", "#428af1", "#5a27bc", "#817f82", "#000000", ""];
export default defineComponent({
  props: {
    value: {
      type: String,
      default: "#000",
    },
    colorArray: {
      type: Array as PropType<string[]>,
      default: colorArray,
    },
  },
  emits: ["change"],
  setup(props, context) {
    const handleChange = (value: string) => {
      context.emit("change", value);
    };
    return {
      handleChange,
    };
  },
});
</script>
<style lang="less">
.colorPickerCom {
  display: flex;
  justify-content: space-around;
  .nativeColorPicker {
    width: 20%;
  }
  ul {
    width: 70%;
    padding-left: 0px;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    li {
      list-style: none;
      width: 20%;
      height: 20%;
      min-width: 20%;
      max-width: 20%;
      .colorInner {
        width: 20px;
        height: 20px;
        border: 1px solid #ccc;
        margin-bottom: 5px;
        border-radius: 3px;
      }
    }
  }
}
</style>
