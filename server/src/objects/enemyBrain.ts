export default class EnemyBrain {
  cooldown: number;
  cooldownCount: number;

  constructor(cooldown: number = Math.random() * 100) {
    this.cooldown = cooldown;
    this.cooldownCount = cooldown;
  }

  public think(): boolean {
    this.cooldownCount--;
    if (this.cooldownCount <= 0) {
      this.cooldownCount = this.cooldown;
      return true;
    }
    return false;
  }
}