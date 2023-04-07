import { Area } from "../area.js";
import { Player } from "../player.js";

export function markPlayers(area: Area, onMarked?: (unmarked: Player, marked: Player) => void) {
  if (area.players.length == 0) return;

  area.players.reduce((prev, curr) => {
    if (!prev.isAlive || !curr.isAlive) return curr;

    prev.generateFightingChance()
    curr.generateFightingChance()
    prev.foughtWith = curr.id;
    curr.foughtWith = prev.id;

    if (prev.getFightingChance() > curr.getFightingChance()) {
      curr.kill();
      if (onMarked)
        onMarked(prev, curr)
    }
    return curr;
  })
}

export function sweepPlayer(area: Area, index: number) {
  if (!area.players[index].isAlive) {
    area.players.splice(index, 1);
  }
}
