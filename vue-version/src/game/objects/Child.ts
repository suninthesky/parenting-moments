import { GameObjects, Scene } from 'phaser';

export class Child extends GameObjects.Sprite {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 'child');
    scene.add.existing(this);
    this.setInteractive();
    
    // Set initial frame if not using animations yet
    this.setTexture('child');
  }

  playAnimation() {
    this.play('child-play');  // or 'parent-play' for Parent.ts
    this.once('animationcomplete', () => {
      this.play('child-idle');  // or 'parent-idle' for Parent.ts
    });
  }

  readAnimation() {
    // Visual feedback for read state
    this.setTint(0x0000ff);
    this.scene.time.delayedCall(500, () => {
      this.clearTint();
    });
  }

  restAnimation() {
    // Visual feedback for rest state
    this.setTint(0xffff00);
    this.scene.time.delayedCall(500, () => {
      this.clearTint();
    });
  }
}