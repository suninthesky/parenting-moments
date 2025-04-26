<template>
  <div class="flex flex-row gap-2 mb-4">
    <div class="flex-1">
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs text-gray-600">Child's Patience</span>
        <span id="mood-emoji" class="text-lg">{{ moodEmoji }}</span>
      </div>
      <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div :style="{ width: mood + '%' }"
          :class="['h-full transition-all duration-500', mood > 60 ? 'bg-green-500' : mood > 30 ? 'bg-yellow-500' : 'bg-red-500']"
          id="mood-meter"></div>
      </div>
    </div>
    <div class="flex-1">
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs text-gray-600">Parent's Patience</span>
        <span id="patience-emoji" class="text-lg">{{ patienceEmoji }}</span>
      </div>
      <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div :style="{ width: patience + '%' }"
          :class="['h-full transition-all duration-500', patience > 60 ? 'bg-blue-500' : patience > 30 ? 'bg-yellow-500' : 'bg-red-500']"
          id="patience-meter"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import { useGameStore } from '../store';
const store = useGameStore();
const mood = computed(() => store.mood);
const patience = computed(() => store.patience);
const moodEmoji = computed(() => mood.value > 60 ? '😊' : mood.value > 30 ? '😐' : '😢');
const patienceEmoji = computed(() => patience.value > 60 ? '🧘' : patience.value > 30 ? '😓' : '😫');
</script>