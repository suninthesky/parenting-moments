import { defineStore } from 'pinia';

interface GameState {
  socialNeeds: number;
  emotionalNeeds: number;
  learningNeeds: number;
  isGameOver: boolean;
}

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    socialNeeds: 100,
    emotionalNeeds: 100,
    learningNeeds: 100,
    isGameOver: false
  }),

  actions: {
    updateNeeds(type: string, value: number) {
      if (type in this) {
        this[type as keyof GameState] = value;
      }
    },

    setGameOver() {
      this.isGameOver = true;
    },

    resetGame() {
      this.socialNeeds = 100;
      this.emotionalNeeds = 100;
      this.learningNeeds = 100;
      this.isGameOver = false;
    }
  }
});