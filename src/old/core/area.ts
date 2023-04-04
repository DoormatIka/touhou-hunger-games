import { Player } from "./player.js"
import { splicePlayerfromPath } from "./actions/move.js";

export class Area {
  public players: Player[] = []
  public to: string[] = []
}

// Maps are better for Data Structures
export function createGraph(objects: Array<string>, routes: Array<Array<string>>) {
  const adj_list = new Map<string, Area>();

  objects.forEach(object => addNode(object, adj_list))
  routes.forEach(route => addEdge(route[0], route[1], adj_list))
  return adj_list;
}
function addEdge(origin: string, dest: string, adj: Map<string, Area>) {
  // making a two way connection
  adj.get(origin)?.to.push(dest)
  adj.get(dest)?.to.push(origin)
}
function addNode(name: string, adj: Map<string, Area>) {
  adj.set(name, new Area())
}


export function shallowTraverseGraph(adj_list: Map<string, Area>, func: (area: Area, current: string) => void) {
  for (const key of adj_list.keys()) {
    const area = adj_list.get(key);
    if (area) {
      func(area, key);
    }
  }
}

export function depthlessKeyGraph(adj_list: Map<string, Area>, key: string, func: (area: Area) => void) {
  const curr_area = adj_list.get(key);
  if (curr_area) {
    func(curr_area)
  }
}

/**
 * Returns the number of areas.
 * 
 * Does a shallow traversal of the graph.
 * @param adj_list - the adjacent list
 * @returns number of areas
 */
export function getAreaLength(
  adj_list: Map<string, Area>,
) {
  return [...adj_list.keys()].length;
}

/**
 * Returns the number of players.
 * 
 * Does a shallow traversal of the graph.
 * Shallow: Disregards ordering for speed.
 * @param adj_list - the adjacent list
 * @returns number of players
 */
export function getPlayersLength(
  adj_list: Map<string, Area>,
) {
  let i = 0;
  const keys = [...adj_list.keys()];
  for (const key of keys) {
    const area = adj_list.get(key);
    i += area?.players.length ?? 0;
  }
  return i;
}






///// DEPTH FIRST SEARCH TRAVERSAL ///////
/**
 * Does a Depth-First Search traversal of the graph. Deep traversal.
 * @param start - What ID to start the traversal
 * @param adj_list - The adjacent list/graph
 * @param func - The function to interact with the results
 */
export function traverseBFSGraph(
  start: string,
  adj_list: Map<string, Area>,
  func: (path_ahead: string, path_current: string, area: Area) => void
) {
  const visited = new Set()
  const queue = [start];

  while (queue.length > 0) {
    const path = queue.shift(); // present
    if (!path) continue;

    const objects = adj_list.get(path);
    if (!objects) continue;
    
    for (const to of objects.to) { // looking ahead
      if (!visited.has(to)) {
        visited.add(to);
        queue.push(to);
      }
      func(to, path, objects);
    }
  }
}

/**
 * Mark players to be killed.
 * 
 * DEPRECATED FOR shallowMarkPlayers
 */
export function markPlayers(start: string, adj_list: Map<string, Area>) {
  traverseBFSGraph(start, adj_list, (_, __, area) => {
    if (area.players.length == 0) return;

    area.players.reduce((prev, curr) => {
      if (!prev.isAlive || !curr.isAlive) return curr;

      prev.generateFightingChance()
      curr.generateFightingChance()

      if (prev.getFightingChance() < curr.getFightingChance()) {
        curr.kill()
      }
      return curr;
    })
  })
}

/**
 * DEPRECATED FOR shallowReturnRelatedPathsofPlayer
 * @param start - What Area ID to start
 * @param playerId - What PlayerID to find
 * @param adj_list - the Adjacency List used to represent the graph
 * @returns An Array of Area IDs related to the player ID
 */
export function returnRelatedPathsofPlayer(start: string, playerId: string, adj_list: Map<string, Area>) {
  let payload: { now: string, related: string[] | undefined } = { 
    now: "",
    related: []
  }
  traverseBFSGraph(start, adj_list, (_, current, area) => {
    for (const player of area.players) {
      if (player.id === playerId) {
        payload = { now: current, related: adj_list.get(current)?.to }
        break;
      }
    }
  })
  return payload;
}

export function deepMoveTo(
  start: string, 
  search: string, 
  playerId: string, 
  adj_list: Map<string, Area>
) {

  const upper_path = adj_list.get(start) // gets the edges of the vertex
  if (!upper_path) return;

  const playerToMove = splicePlayerfromPath(upper_path, playerId);
  if (!playerToMove) return;

  // if they're dead, don't add them back into the graph
  // the sweep part of the mark & sweep process
  if (!playerToMove.isAlive) return;


  for (const nested_path_string of upper_path.to) {
    if (nested_path_string === search) {
      const nested_area = adj_list.get(nested_path_string);

      nested_area?.players.push(playerToMove);
      playerToMove.currentArea = nested_path_string;

      return nested_path_string;
    }
  }
}