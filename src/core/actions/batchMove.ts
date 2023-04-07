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
    if (player.hasPlayed) 
      continue;

      player.generateMoveChances();
      const move_chance = player.getMoveChance()
      if (move_chance.chance < move_chance.half) {
        player.hasPlayed = true;
        if (onStay)
          onStay(player)
        continue;
      }

    const ran = generateRandomNumber(area.to.length);
    console.time("splice")
    moveTo(area, adj_list, player, i, ran);
    console.timeEnd("splice")
    if (onMove)
      onMove(player, area.to[ran])
    
  }
}
function moveTo(
  area: Area, 
  adj_list: Map<string, Area>, 
  player: Player, 
  player_index: number,
  area_index: number
) {
  const chosen_area = adj_list.get(area.to[area_index])!;

  player.currentArea = area.to[area_index];
  player.hasPlayed = true;
  // is pop better?
  
    chosen_area.players.push(area.players.splice(player_index, 1)[0]);
  
}

