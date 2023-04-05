import { Area } from "../area.js";
import { Player, generateRandomNumber } from "../player.js";

/**
 * Random movement!!
 * @param area 
 * @param adj_list 
 * @param onMove 
 */
export function arrayMoveTo(
  area: Area,
  adj_list: Map<string, Area>,
  onMove?: (player: Player, moved_to: string) => void,
  onStay?: (player: Player) => void
) {
  for (let i = area.players.length - 1; i >= 0; i--) {
    const player = area.players[i];

    player.generateMoveChances();
    const move_chance = player.getMoveChance()
    if (move_chance.chance < move_chance.half) {
      player.hasPlayed = true;
      if (onStay)
        onStay(player)
      continue;
    }

    if (player.hasPlayed) 
      continue;

    const ran = generateRandomNumber(area.to.length);
    
    const chosen_area = adj_list.get(area.to[ran])!;

    player.currentArea = area.to[ran];
    player.hasPlayed = true;
    if (onMove)
      onMove(player, area.to[ran])

    chosen_area.players.push(area.players.splice(i, 1)[0])
    
  }
}
