import { AUTO, Scale, Types } from 'phaser';

export const gameConfig: Types.Core.GameConfig = {
  type: AUTO,
  parent: 'game-container',
  width: 800,
  height: 600,
  backgroundColor: '#f0f9ff',
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
};
