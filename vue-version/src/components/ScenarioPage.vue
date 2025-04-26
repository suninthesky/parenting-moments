<template>
  <main class="flex-1 flex flex-col justify-center items-center px-2">
    <div class="w-full max-w-md mx-auto bg-white/90 rounded-lg shadow-lg mt-4 mb-4">
      <div class="p-4">
        <h2 class="text-xl font-bold text-blue-700 mb-2">Scenario {{ scenarioIdx + 1 }} of {{ total }}</h2>
        <StatusBars />
        <TimerBar :duration="10" :onTimeout="onTimeout" />
        <p class="text-lg text-gray-800 mb-6">{{ scenario.situation }}</p>
        <div class="space-y-3">
          <button v-for="option in scenario.options" :key="option.id"
            class="w-full text-left px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-98"
            @click="choose(option)">{{ option.text }}</button>
        </div>
        <div class="mt-6 bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400">
          <h4 class="font-semibold text-yellow-800 mb-2">Parenting Tip:</h4>
          <p class="text-yellow-700 text-sm">{{ scenario.tip }}</p>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref } from 'vue';
import { useGameStore } from '../store';
import StatusBars from './StatusBars.vue';
import TimerBar from './TimerBar.vue';
const props = defineProps({ scenario: Object, scenarioIdx: Number, total: Number, onChoose: Function });
const store = useGameStore();
const timedOut = ref(false);
function onTimeout() {
  timedOut.value = true;
  // Lower patience every second until a choice is made
  let interval = setInterval(() => {
    if (!timedOut.value) return clearInterval(interval);
    store.setMoodPatience(store.mood, Math.max(0, store.patience - 2));
  }, 1000);
}
function choose(option) {
  timedOut.value = false;
  props.onChoose(option);
}
</script>