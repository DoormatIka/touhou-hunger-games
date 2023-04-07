export type PlayerPresets = "TANK" | "NORMAL" | "LIGHT";

export class Player {
  public isAlive = true;
  public hasPlayed = false;
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
    private move_chance_half: number = 50,
    private type: PlayerPresets
  ) {
    if (move_chance_half > 100) {
      throw Error(`${this.id} has a move_chance_half higher than 100!`)
    }
  }

  generateMoveChances() {
    this.action_chance.move  = generateRandomNumber(100);
  }
  generateFightingChance() {
    this.fighting_chance = generateRandomNumber(this.fighting_chance_limit);
  }
  getFightingChance() {
    return this.fighting_chance;
  }
  getMoveChance() {
    return { 
      chance: this.action_chance.move, half: this.move_chance_half 
    };
  }
  getType() {
    return this.type;
  }
  kill() { // random events whenever someone dies
    this.isAlive = false;
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
 * Tips: 
 * - Tons of tanks = slower game
 * - Tons of lights = faster game
 * - Tons of normals = wild card
 */
export function createPlayers(
  players_config: { player: string, preset: PlayerPresets }[],
  currentArea: string
) {
  const players = []
  for (const player_config of players_config) {
    let fighting_chance_limit, move_chance_half;
    // move_chance_half: the higher, the less the player moves
    // fighting_chance_limit: the higher (from NORMAL: 100), the more the player wins fights
    switch (player_config.preset) {
      case "TANK":
        fighting_chance_limit = 80
        move_chance_half = 50
        break;
      case "NORMAL":
        fighting_chance_limit = 100
        move_chance_half = 37
        break;
      case "LIGHT":
        fighting_chance_limit = 120
        move_chance_half = 10
        break;
      default:
        throw Error(`${player_config.player}: Invalid preset "${player_config.preset}"`);
    }
    const player = new Player(
      player_config.player, 
      fighting_chance_limit, 
      move_chance_half, 
      player_config.preset
    );
    player.currentArea = currentArea;
    players.push(player);
  }
  return players;
}