<template>
  <main class="flex-1 flex flex-col items-center px-2">
    <div class="w-full max-w-md mx-auto bg-white/90 rounded-lg shadow-lg mt-4 mb-4">
      <div class="p-4">
        <h2 class="text-xl font-bold text-blue-700 mb-2">Outcome</h2>
        <StatusBars />
        <p class="text-lg font-bold text-gray-800 mb-4">{{ option.outcome }}</p>
        <div class="bg-blue-50 p-4 rounded-lg mb-4">
          <h4 class="font-semibold text-blue-800 mb-2">Social & Emotional Learning</h4>
          <p class="text-blue-600 text-sm">{{ option.socialEmotionalLearning }}</p>
        </div>
        <div class="bg-yellow-50 p-4 rounded-lg mb-4">
          <h4 class="font-semibold text-yellow-800 mb-2">Parenting Strategy Used</h4>
          <p class="text-yellow-700 text-sm">{{ strategy.description }}</p>
          <p class="text-yellow-600 text-xs mt-2"><strong>Research shows:</strong> {{ strategy.evidence }}</p>
        </div>
        <button
          class="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-98"
          @click="$emit('next')">
          {{ isLast ? 'See My Results' : 'Next Scenario' }}
        </button>
      </div>
    </div>
  </main>
</template>
<script setup>
import { computed } from 'vue';
import { parentingStrategies } from '../data/strategies';
import StatusBars from './StatusBars.vue';
const props = defineProps({ option: Object, isLast: Boolean });
const strategy = computed(() => parentingStrategies[props.option.strategy]);
</script>