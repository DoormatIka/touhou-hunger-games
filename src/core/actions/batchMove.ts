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
  onBarriered: (player: Player, moved_to: string) => void,
  distance_limit: number
) {
  for (let player_index = area.players.length - 1; player_index >= 0; player_index--) {
    const player = area.players[player_index];
    if (player.hasPlayed)
      continue;

    const ifStay = calculateStayChance(player)
    if (ifStay) {
      onStay(player);
      continue;
    }

    const ran = generateRandomNumber(area.to.length);
    const if_touching_barrier = moveTo(area, adj_list, player, player_index, ran, distance_limit);
    if (if_touching_barrier?.barrier) {
      // find any un-barriered area
      // iffy performance

      // only finds a barrier next to the player
      // should find the nearest barrier to avoid players getting stuck inside a barrier.
      const areas = area.to.filter(v => {
        const area = adj_list.get(v)!
        return area.layer < distance_limit;
      });
      const ran = generateRandomNumber(areas.length);
      moveTo(area, adj_list, player, player_index, ran, distance_limit);
      onBarriered(player, areas[ran])
      continue;
    }

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
  distance_limit?: number,
) {
  const chosen_area = adj_list.get(area.to[area_index])!;

  if (distance_limit !== undefined) {
    if (chosen_area.layer > distance_limit) {
      player.hasPlayed = true;
      return { barrier: true }
    }
  }

  player.currentArea = area.to[area_index];
  player.hasPlayed = true;
  chosen_area.players.push(area.players.splice(player_index, 1)[0]);
}

