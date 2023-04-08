import { Area } from "../area.js";
import { Player } from "../player.js";


/**
 * Compares 2 players and makes them fist fight.
 * 
 * Should be before randomDeathPlayers
 * @param area 
 * @param onKillMarked 
 * @returns 
 */
export function vsPlayers(
  area: Area,
  onKillMarked?: (unmarked: Player, marked: Player) => void
) {
  if (area.players.length <= 1) return;

  for (let i = 0; i < area.players.length; i++) {
    const curr = area.players[i];
    const prev = i > 0 ? area.players[i - 1] : null;
    if (!prev?.isAlive || !curr.isAlive)
      continue;

    prev.generateFightingChance()
    curr.generateFightingChance()
    prev.foughtWith = curr.id;
    curr.foughtWith = prev.id;

    if (prev.getFightingChance() > curr.getFightingChance()) {
      curr.kill();
      if (onKillMarked)
        onKillMarked(prev, curr);
    }
  }
}

export function randomDeathPlayers(
  area: Area,
  onKill?: (player: Player) => void
) {
  for (let i = 0; i < area.players.length; i++) {
    const curr = area.players[i];
    if (!curr.isAlive)
      continue;
    
    curr.generateRandomDeathChance();
    const death_chance = curr.getRandomDeathChance();
    if (death_chance.chance < death_chance.half) {
      curr.kill();
      if (onKill)
        onKill(curr);
    }
  }
}

export function sweepPlayer(area: Area, index: number) {
  if (!area.players[index].isAlive) {
    area.players.splice(index, 1);
  }
}
