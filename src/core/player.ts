export class Player {
  public isAlive = true;
  public hasPlayed = false;
  public currentArea = "";
  public foughtWith = "";

  private fighting_chance = 100;
  private random_death_chance = 100;
  private action_chance = {
    move: 100,
  };

  constructor(
    public id: string, 
    private fighting_chance_limit: number = 100,
    private move_chance_half: number = 50,
    private random_death_chance_half: number = 50,
  ) {
    if (
      move_chance_half > 100 || 
      random_death_chance_half > 100
    ) {
      throw Error(`${this.id} has a move_chance_half or random_death_chance higher than 100!`)
    }
  }
  generateMoveChances() {
    this.action_chance.move  = generateRandomNumber(100);
  }
  generateFightingChance() {
    this.fighting_chance = generateRandomNumber(this.fighting_chance_limit);
  }
  generateRandomDeathChance() {
    this.random_death_chance = generateRandomNumber(1000);
  }
  getFightingChance() {
    return this.fighting_chance;
  }
  getMoveChance() {
    return { 
      chance: this.action_chance.move, half: this.move_chance_half 
    };
  }
  getRandomDeathChance() {
    return {
      chance: this.random_death_chance,
      half: this.random_death_chance_half
    }
  }
  kill() {
    this.isAlive = false;
  }
  toString() {
    return `[${this.id}] = Random chance of death: ${this.random_death_chance_half / 1000}% | Fighting limit: ${this.fighting_chance_limit}`
  }
}

/**
 * exclusive to limit
 * @param limit - [0-limit)
 */
export function generateRandomNumber(limit: number) {
  return Math.floor(Math.random() * limit)
}

// random action picker to send random events like in the original hunger games
export function actionPicker() {
  throw Error(`Unimplemented: ${actionPicker.name}`)
}


/**
 * Creates a batch of players using presets.
 * @param players_config - Config for players
 * @param currentArea - Areas to drop in
 * @returns Player objects
 * 
 */
export function createPlayers(
  players_config: string[],
  currentArea: string
) {
  const players = []
  for (const player_name of players_config) {
    const player = new Player(player_name, 1000, 15, 100);
    // console.log(player.toString())
    player.currentArea = currentArea;
    players.push(player);
  }
  return players;
}