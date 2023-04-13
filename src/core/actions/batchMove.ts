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
  onMove: (player: Player, moved_to: string) => void,
  onStay: (player: Player) => void,
  distance_limit?: number
) {
  for (let i = area.players.length - 1; i >= 0; i--) {
    const player = area.players[i];
    if (player.hasPlayed)
      continue;

    const ifStay = calculateStayChance(player)
    if (ifStay) {
      onStay(player);
      continue;
    }

    const ran = generateRandomNumber(area.to.length);
    moveTo(area, adj_list, player, i, ran);
    if (onMove)
      onMove(player, area.to[ran])
  }
}

function calculateStayChance(player: Player) {
  player.generateMoveChances();
  const move_chance = player.getMoveChance()
  if (move_chance.chance < move_chance.half) {
    player.hasPlayed = true;
    return true;    
  }
  return false;
}


function moveTo(
  area: Area,
  adj_list: Map<string, Area>,
  player: Player,
  player_index: number,
  area_index: number,
  distance_limit?: number
) {
  const chosen_area = adj_list.get(area.to[area_index])!;

  if (distance_limit) {
    if (chosen_area.layer < distance_limit) {
      player.hasPlayed = true;
      return;
    }
  }

  player.currentArea = area.to[area_index];
  player.hasPlayed = true;
  chosen_area.players.push(area.players.splice(player_index, 1)[0]);
}

