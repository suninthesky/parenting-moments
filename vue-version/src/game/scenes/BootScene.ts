import { Scene } from 'phaser';

export class BootScene extends Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Load sprite sheets instead of single images
    this.load.spritesheet('child', 'assets/sprites/child.png', {
      frameWidth: 32,  // adjust based on your sprite sheet
      frameHeight: 32  // adjust based on your sprite sheet
    });
    
    this.load.spritesheet('parent', 'assets/sprites/parent.png', {
      frameWidth: 32,  // adjust based on your sprite sheet
      frameHeight: 32  // adjust based on your sprite sheet
    });

    // ... rest of your preload
  }

  create() {
    // Create the animations
    this.anims.create({
      key: 'child-idle',
      frames: this.anims.generateFrameNumbers('child', { start: 0, end: 0 }),
      frameRate: 1,
      repeat: 0
    });

    this.anims.create({
      key: 'parent-idle',
      frames: this.anims.generateFrameNumbers('parent', { start: 0, end: 0 }),
      frameRate: 1,
      repeat: 0
    });

    this.scene.start('MainScene');
  }
}