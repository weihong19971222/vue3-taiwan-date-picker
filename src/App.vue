<script setup lang="ts">
import TaiwanDatePicker from './components/TaiwanDatePicker.vue'
import {ref} from "vue";

const testdate = ref("")

</script>

<template>
  <h1>日期選擇器(民國年)</h1>   
  <div style="display: flex;justify-content: center;">
    <TaiwanDatePicker v-model="testdate"/>
  </div>
  <div>
    v-model-value : {{ testdate }}
  </div>
</template>
