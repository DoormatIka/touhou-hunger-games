import { shallowTraverseGraph, Area } from "../area.js";

export function batchMoveTo(adj_list: Map<string, Area>) {
  shallowTraverseGraph(adj_list, (area, current) => {
    for (const player of area.players) {
      player
    }
  })
}

/**
 * Handles the movement of the player.
 * @param start - the current place of the player
 * @param search - where to go
 * @param playerId - the player id
 * @param adj_list - the adjacent list
 * @returns - Where it moved.
 */
export function moveTo(
  start: string, 
  search: string, 
  playerId: string, 
  adj_list: Map<string, Area>
) {
  const upper_path = adj_list.get(start) // gets the edges of the vertex
  if (!upper_path) return;

  const playerToMove = splicePlayerfromPath(upper_path, playerId);
  if (!playerToMove) return;

  for (const nested_path_string of upper_path.to) {
    if (nested_path_string === search) {
      const nested_area = adj_list.get(nested_path_string);

      nested_area?.players.push(playerToMove);
      playerToMove.currentArea = nested_path_string;

      return nested_path_string;
    }
  }
}

/**
 * Moves the players randomly.
 * 
 * @param playerId - the player to move
 * @param adj_list - the Adjacent list
 * @returns An object where the player moved and where it was before.
 */
export function moveRandom(
  playerId: string, 
  adj_list: Map<string, Area>
) {
  const paths = shallowReturnRelatedPathsofPlayer(adj_list, playerId);
  if (!(paths && paths.related)) return;

  // take into account move chances

  const random_choice = Math.floor(Math.random() * paths.related.length);
  const moved = moveTo(paths.now, paths.related[random_choice], playerId, adj_list);
  if (moved) {
    return { to: moved, from: paths.now }
  }
}

export function splicePlayerfromPath(upper_path: Area, playerId: string) {
  const index = upper_path.players.findIndex(v => v.id === playerId);
  if (index === -1) return;

  return upper_path.players.splice(index, 1)[0];
}

export function shallowReturnRelatedPathsofPlayer(adj_list: Map<string, Area>, playerId: string) {
  let payload: { now: string, related: string[] | undefined } = { now: "", related: [] }
  shallowTraverseGraph(adj_list, (area, curr) => {
    for (const player of area.players) {
      if (player.id === playerId) {
        payload = { now: curr, related: area.to }
        break;
      }
    }
  })
  return payload;
}