import { Scene } from 'phaser';
import { Child } from '../objects/Child';
import { Parent } from '../objects/Parent';

export class MainScene extends Scene {
  private child!: Child;
  private parent!: Parent;
  private needsTimer!: Phaser.Time.TimerEvent;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    // Set up background
    this.add.image(400, 300, 'room');

    // Create characters
    this.child = new Child(this, 300, 400);
    this.parent = new Parent(this, 500, 400);

    // Initialize needs system
    this.initializeNeeds();

    // Set up interaction zones
    this.createInteractionZones();

    // Start needs decay timer
    this.needsTimer = this.time.addEvent({
      delay: 1000,
      callback: this.updateNeeds,
      callbackScope: this,
      loop: true
    });
  }

  private initializeNeeds() {
    this.registry.set('socialNeeds', 100);
    this.registry.set('emotionalNeeds', 100);
    this.registry.set('learningNeeds', 100);
  }

  private createInteractionZones() {
    const zones = [
      { x: 200, y: 300, name: 'playZone' },
      { x: 400, y: 300, name: 'readingZone' },
      { x: 600, y: 300, name: 'restZone' }
    ];

    zones.forEach(zone => {
      const interactionZone = this.add.zone(zone.x, zone.y, 100, 100);
      interactionZone.setInteractive({ useHandCursor: true });
      interactionZone.on('pointerdown', () => this.handleZoneInteraction(zone.name));
    });
  }

  private handleZoneInteraction(zoneName: string) {
    switch (zoneName) {
      case 'playZone':
        this.handlePlay();
        break;
      case 'readingZone':
        this.handleReading();
        break;
      case 'restZone':
        this.handleRest();
        break;
    }
  }

  private updateNeeds() {
    ['socialNeeds', 'emotionalNeeds', 'learningNeeds'].forEach(need => {
      const currentValue = this.registry.get(need);
      const newValue = Math.max(0, currentValue - 0.5);
      this.registry.set(need, newValue);
      
      // Emit event for UI updates
      this.events.emit('needsUpdated', {
        type: need,
        value: newValue
      });

      // Check for game over condition
      if (newValue === 0) {
        this.handleGameOver();
      }
    });
  }

  private handlePlay() {
    this.child.playAnimation();
    this.parent.playAnimation();
    this.registry.values.socialNeeds = Math.min(100, this.registry.values.socialNeeds + 10);
    this.sound.play('success');
  }

  private handleReading() {
    this.child.readAnimation();
    this.parent.readAnimation();
    this.registry.values.learningNeeds = Math.min(100, this.registry.values.learningNeeds + 10);
    this.sound.play('success');
  }

  private handleRest() {
    this.child.restAnimation();
    this.parent.restAnimation();
    this.registry.values.emotionalNeeds = Math.min(100, this.registry.values.emotionalNeeds + 10);
    this.sound.play('success');
  }

  private handleGameOver() {
    this.scene.pause();
    this.events.emit('gameOver');
  }
}