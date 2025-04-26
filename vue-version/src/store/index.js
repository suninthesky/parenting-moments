import { defineStore } from 'pinia';
import { scenarios } from '../data/scenarios';

const STORAGE_KEY = 'parenting-moments-progress';

function loadProgress() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data
    ? JSON.parse(data)
    : { current: 0, choices: [], mood: 100, patience: 100 };
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export const useGameStore = defineStore('game', {
  state: () => ({
    current: 0,
    choices: [],
    mood: 100,
    patience: 100,
    ...loadProgress()
  }),
  actions: {
    choose(option, impact) {
      this.choices[this.current] = option;
      this.current++;
      // Update mood/patience based on impact
      if (impact === 'positive') {
        this.mood = Math.min(100, this.mood + 10);
        this.patience = Math.min(100, this.patience + 5);
      } else if (impact === 'negative') {
        this.mood = Math.max(0, this.mood - 15);
        this.patience = Math.max(0, this.patience - 10);
      }
      saveProgress(this.$state);
    },
    reset() {
      this.current = 0;
      this.choices = [];
      this.mood = 100;
      this.patience = 100;
      saveProgress(this.$state);
    },
    setMoodPatience(mood, patience) {
      this.mood = mood;
      this.patience = patience;
      saveProgress(this.$state);
    }
  }
});