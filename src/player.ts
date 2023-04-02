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
  kill() {
    this.isAlive = false;
  }
}

/**
 * @param player1 - Player object
 * @param player2 - Player object
 * @returns - individual chances for players
 */
export function compareFightingChance(player1: Player, player2: Player) {
  const p2_chance = player2.generateFightingChance()
  const p1_chance = player1.generateFightingChance()
  const if_player1_wins = p1_chance > p2_chance;
  
  player1.isAlive = if_player1_wins;
  player2.isAlive = !if_player1_wins;
  
  return { p1_chance, p2_chance };
}

// random action picker to send random events like in the original hunger games
export function actionPicker() {
  throw Error(`Unimplemented: ${actionPicker.name}`)
}