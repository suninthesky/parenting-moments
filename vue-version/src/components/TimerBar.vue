<template>
  <div v-if="!timeout" class="relative h-2 w-full rounded-lg overflow-hidden mb-4 bg-gray-200">
    <div :style="{ width: percent + '%' }"
      :class="['h-full transition-all duration-500', percent > 60 ? 'bg-green-500' : percent > 30 ? 'bg-yellow-500' : 'bg-red-500']"
      id="timer-bar"></div>
  </div>
  <div v-if="timeout" class="mb-2 text-red-600 text-sm font-semibold text-center">
    Hurry up! Patience is lowering...
  </div>
</template>
<script setup>
import { ref, watch, onUnmounted } from 'vue';
const props = defineProps({ duration: Number, onTimeout: Function });
const percent = ref(100);
const timeout = ref(false);
let timer = null;
let left = props.duration;

function tick() {
  left--;
  percent.value = Math.max(0, (left / props.duration) * 100);
  if (left <= 0) {
    timeout.value = true;
    clearInterval(timer);
    props.onTimeout && props.onTimeout();
  }
}
function start() {
  left = props.duration;
  percent.value = 100;
  timeout.value = false;
  clearInterval(timer);
  timer = setInterval(tick, 1000);
}
watch(() => props.duration, start, { immediate: true });
onUnmounted(() => clearInterval(timer));
</script>