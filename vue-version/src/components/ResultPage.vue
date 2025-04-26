<template>
  <main class="flex-1 flex flex-col items-center px-2">
    <div class="w-full max-w-md mx-auto bg-white/90 rounded-lg shadow-lg mt-4 mb-4">
      <div class="p-4">
        <h2 class="text-2xl font-bold text-blue-700 mb-4">Your Parenting Journey</h2>
        <StatusBars />
        <div v-if="resultMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {{ resultMessage }}
        </div>
        <ol class="mb-4">
          <li v-for="(choice, idx) in choices" :key="idx" class="mb-3">
            <div class="font-semibold text-blue-800 mb-1">Scenario {{ idx + 1 }}:</div>
            <div class="text-gray-800 mb-1">{{ scenarios[idx].situation }}</div>
            <div class="text-green-700 mb-1">Your choice: {{scenarios[idx].options.find(o => o.id === choice.id).text
              }}</div>
            <div class="text-blue-600 text-sm mb-1">{{scenarios[idx].options.find(o => o.id ===
              choice.id).socialEmotionalLearning }}</div>
            <div class="text-yellow-700 text-xs mb-1">Strategy: {{strategies[scenarios[idx].options.find(o => o.id ===
              choice.id).strategy].description }}</div>
          </li>
        </ol>
        <div class="mt-4">
          <h3 class="font-semibold text-lg text-blue-700 mb-2">Actionable Guidance</h3>
          <ul class="list-disc pl-5 text-sm text-gray-700">
            <li v-for="(desc, strat) in usedStrategies" :key="strat">
              <span class="font-semibold">{{ strategies[strat].description }}:</span> {{ strategies[strat].evidence }}
            </li>
          </ul>
        </div>
        <button
          class="w-full mt-6 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-98"
          @click="restart"
        >Restart</button>
      </div>
    </div>
  </main>
</template>
<script setup>
import { useGameStore } from '../store';
import StatusBars from './StatusBars.vue';
const props = defineProps({ resultMessage: String });
const store = useGameStore();
function restart() {
  store.reset();
  window.location.reload();
}
</script>