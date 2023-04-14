import { Player } from "./player.js"

export class Area {
  public players: Player[] = [] // if needed, turn this into a hashmap/Map object
  public to: string[] = []
  public layer: number = 0
  constructor(public name: string = "") {}
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
  const area = new Area(name)
  adj.set(name, area)
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

/**
 * Labels the distances from one point to multiple.
 * @param root Where to start
 * @param adj_list What graph to modify
 */
export function labelDistances(root: string, adj_list: Map<string, Area>) {
  const queue: string[] = [root];
  const visited = new Set<string>();
  visited.add(root);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentObject = adj_list.get(current)!
    const currentDistance = currentObject.layer;

    for (const neighbor of currentObject.to) {
      if (!visited.has(neighbor)) {
        const neighborObject = adj_list.get(neighbor)!
        queue.push(neighbor);
        visited.add(neighbor);
        neighborObject.layer = currentDistance + 1;
      }
    }
  }
}