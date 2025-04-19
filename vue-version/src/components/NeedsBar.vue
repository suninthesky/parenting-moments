<template>
  <div class="needs-bar">
    <div class="need">
      <span class="label">Social</span>
      <div class="bar-container">
        <div class="bar" :style="{ width: `${socialNeeds}%`, backgroundColor: getColor(socialNeeds) }" />
      </div>
    </div>
    <div class="need">
      <span class="label">Emotional</span>
      <div class="bar-container">
        <div class="bar" :style="{ width: `${emotionalNeeds}%`, backgroundColor: getColor(emotionalNeeds) }" />
      </div>
    </div>
    <div class="need">
      <span class="label">Learning</span>
      <div class="bar-container">
        <div class="bar" :style="{ width: `${learningNeeds}%`, backgroundColor: getColor(learningNeeds) }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../stores/game';

const store = useGameStore();

const socialNeeds = computed(() => store.socialNeeds);
const emotionalNeeds = computed(() => store.emotionalNeeds);
const learningNeeds = computed(() => store.learningNeeds);

const getColor = (value: number) => {
  if (value > 66) return '#22c55e';
  if (value > 33) return '#eab308';
  return '#ef4444';
};
</script>

<style scoped>
.needs-bar {
  @apply fixed top-4 left-4 bg-white/90 p-4 rounded-lg shadow-lg;
}

.need {
  @apply mb-2 last:mb-0;
}

.label {
  @apply text-sm font-medium text-gray-600;
}

.bar-container {
  @apply h-2 bg-gray-200 rounded-full overflow-hidden mt-1;
}

.bar {
  @apply h-full transition-all duration-500;
}
</style>