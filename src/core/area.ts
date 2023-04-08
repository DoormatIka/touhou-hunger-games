import { Player } from "./player.js"

export class Area {
  public players: Player[] = [] // if needed, turn this into a hashmap/Map object
  public to: string[] = []
}

// Maps are better for Data Structures
export function createGraph(args: {objects: Array<string>, routes: Array<Array<string>>}) {
  const { objects, routes } = args;
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
export function getPlayersLength(adj_list: Map<string, Area>) {
  let i = 0;
  for (const key of adj_list.keys()) {
    const area = adj_list.get(key);
    i += area?.players.length ?? 0;
  }
  return i;
}

export function getLastPlayer(adj_list: Map<string, Area>) {
  for (const key of adj_list.keys()) {
    const area = adj_list.get(key);
    if (!area)
      continue;

    if (area.players.length !== 0) {
      return area.players[0]
    }
  }
}