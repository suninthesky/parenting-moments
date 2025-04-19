<template>
  <div class="relative">
    <div id="game-container" />
    <NeedsBar />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { Game } from 'phaser';
import { gameConfig } from '../game/config';
import { BootScene } from '../game/scenes/BootScene';
import { MainScene } from '../game/scenes/MainScene';
import { useGameStore } from '../stores/game';
import NeedsBar from './NeedsBar.vue';

let game: Game;
const store = useGameStore();

onMounted(() => {
  game = new Game({
    ...gameConfig,
    scene: [BootScene, MainScene]
  });

  // Listen for game events
  const mainScene = game.scene.getScene('MainScene');
  if (mainScene) {
    mainScene.events.on('needsUpdated', ({ type, value }) => {
      store.updateNeeds(type, value);
    });

    mainScene.events.on('gameOver', () => {
      store.setGameOver();
    });
  }
});

onUnmounted(() => {
  if (game) {
    game.destroy(true);
  }
});
</script>