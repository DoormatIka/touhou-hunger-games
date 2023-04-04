
export class Player {
  public isAlive = true;
  public hasMoved = false;
  public currentArea = "";
  public foughtWith = "";

  private fighting_chance = 100;
  private action_chance = {
    fight: 100,
    move: 100,
  };

  constructor(
    public id: string, 
    private fighting_chance_limit: number = 100,
  ) {}

  generateActionChances() {
    this.action_chance.fight = generateRandomNumber(100);
  }
  generateFightingChance() {
    this.fighting_chance = generateRandomNumber(this.fighting_chance_limit);
  }
  getFightingChance() {
    return this.fighting_chance;
  }
  getActionChance() {
    return this.action_chance;
  }
  kill() { // random events whenever someone dies
    this.isAlive = false;
  }
}

/**
 * inclusive to limit
 * @param limit - [0-limit]
 */
export function generateRandomNumber(limit: number) {
  return Math.floor(Math.random() * (limit + 1))
}

// random action picker to send random events like in the original hunger games
export function actionPicker() {
  throw Error(`Unimplemented: ${actionPicker.name}`)
}
