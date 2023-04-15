import { Area } from "../area.js";
import { traverseBFSGraph } from "../helpers/bfs.js";
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
    // should find the nearest unbarriered area to avoid players getting stuck inside a barriered area.
    if (if_touching_barrier?.barrier) {
      barrierAllStepHandler(area, adj_list, distance_limit, player, player_index, onBarriered);
    }

    if (onMove)
      onMove(player, area.to[ran])
  }
}

function barrierOneStepHandler(
  area: Area, 
  adj_list: Map<string, Area>, 
  distance_limit: number, 
  player: Player, 
  player_index: number, 
  onBarriered: (player: Player, moved_to: string) => void
) {
  const areas = area.to.filter(v => {
    const area = adj_list.get(v)!;
    return area.layer < distance_limit;
  });
  const ran = generateRandomNumber(areas.length);
  moveTo(area, adj_list, player, player_index, ran, distance_limit);
  onBarriered(player, areas[ran]);
}

function barrierAllStepHandler(
  area: Area,
  adj_list: Map<string, Area>,
  distance_limit: number,
  player: Player,
  player_index: number,
  onBarriered: (player: Player, moved_to: string) => void
) {
  let free: string = ""
  traverseBFSGraph(
    area.name, 
    adj_list, (ahead, curr, area_curr) => {
      const area_ahead = adj_list.get(ahead)!;
      if (area_ahead.layer < distance_limit) {
        free = ahead;
        return true;
      }
    })
  const free_area = adj_list.get(free)!;
  free_area.players.push(area.players.splice(player_index, 1)[0]);
  onBarriered(player, free);
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

