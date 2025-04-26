<template>
  <main class="flex-1 flex flex-col items-center px-2">
    <div class="w-full max-w-md mx-auto bg-white/90 rounded-lg shadow-lg mt-4 mb-4">
      <div class="p-4">
        <h2 class="text-xl font-bold text-blue-700 mb-2">Scenario {{ scenarioIdx + 1 }} of {{ total }}</h2>
        <TimerBar :duration="10" :onTimeout="onTimeout" />
        <StatusBars />
        <p class="text-lg font-bold text-gray-800 mb-4">{{ scenario.situation }}</p>
        <div class="space-y-3">
          <button
            v-for="option in scenario.options"
            :key="option.id"
            class="w-full text-left px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-98"
            @click="choose(option)"
          >{{ option.text }}</button>
        </div>
        <div
          class="mt-6 bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400 transition-all duration-500"
          v-show="showTip"
        >
          <h4 class="font-semibold text-yellow-800 mb-2">Parenting Tip:</h4>
          <p class="text-yellow-700 text-sm">{{ scenario.tip }}</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useGameStore } from '../store';
import StatusBars from './StatusBars.vue';
import TimerBar from './TimerBar.vue';

const props = defineProps({
  scenario: Object,
  scenarioIdx: Number,
  total: Number,
  onChoose: Function,
  onTimeoutDeplete: Function // callback for when patience/mood depletes
});
const store = useGameStore();

const showTip = ref(false);
const timeoutActive = ref(false);
let tipTimeout = null;
let depleteInterval = null;

function onTimeout() {
  timeoutActive.value = true;
  // Start lowering both bars every second
  depleteInterval = setInterval(() => {
    if (store.mood > 0) store.mood = Math.max(0, store.mood - 5);
    if (store.patience > 0) store.patience = Math.max(0, store.patience - 5);
    if (store.mood === 0 || store.patience === 0) {
      clearInterval(depleteInterval);
      props.onTimeoutDeplete && props.onTimeoutDeplete();
    }
  }, 1000);
}

function choose(option) {
  timeoutActive.value = false;
  clearInterval(depleteInterval);
  props.onChoose(option);
}

onMounted(() => {
  showTip.value = false;
  timeoutActive.value = false;
  // Show tip after half the timer
  tipTimeout = setTimeout(() => {
    showTip.value = true;
  }, 5000); // half of 10s
});

onUnmounted(() => {
  clearTimeout(tipTimeout);
  clearInterval(depleteInterval);
});
</script>