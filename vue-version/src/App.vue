<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
    <component :is="currentComponent" v-bind="currentProps" @start="start" @choose="choose" @next="next" />
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useGameStore } from './store';
import { scenarios } from './data/scenarios';
import { parentingStrategies } from './data/strategies';
import LandingPage from './components/LandingPage.vue';
import ScenarioPage from './components/ScenarioPage.vue';
import OutcomePage from './components/OutcomePage.vue';
import ResultPage from './components/ResultPage.vue';

const store = useGameStore();
const phase = ref('landing'); // 'landing' | 'scenario' | 'outcome' | 'result'
const currentOption = ref(null);

const currentComponent = computed(() => {
  if (phase.value === 'landing') return LandingPage;
  if (phase.value === 'scenario') return ScenarioPage;
  if (phase.value === 'outcome') return OutcomePage;
  if (phase.value === 'result') return ResultPage;
});
const currentProps = computed(() => {
  if (phase.value === 'scenario') {
    return {
      scenario: scenarios[store.current],
      scenarioIdx: store.current,
      total: scenarios.length,
      onChoose: choose
    };
  }
  if (phase.value === 'outcome') {
    return {
      option: currentOption.value,
      isLast: store.current >= scenarios.length
    };
  }
  return {};
});

function start() {
  store.reset();
  phase.value = 'scenario';
}
function choose(option) {
  store.choose(option.id, option.impact);
  currentOption.value = option;
  phase.value = 'outcome';
}
function next() {
  if (store.current >= scenarios.length) {
    phase.value = 'result';
  } else {
    phase.value = 'scenario';
  }
}
</script>
