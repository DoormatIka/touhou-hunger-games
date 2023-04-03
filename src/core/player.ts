export class Player {
  public isAlive = true;
  public currentArea = "";
  private fighting_chance = 100;
  constructor(public id: string, private fighting_chance_limit: number = 100) {}

  generateFightingChance() {
    this.fighting_chance = Math.floor(Math.random() * (this.fighting_chance_limit + 1))
  }
  getFightingChance() {
    return this.fighting_chance
  }
  kill() { // random events whenever someone dies
    this.isAlive = false;
  }
}

// random action picker to send random events like in the original hunger games
export function actionPicker() {
  throw Error(`Unimplemented: ${actionPicker.name}`)
}