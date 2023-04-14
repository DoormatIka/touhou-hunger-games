import { Area } from "../area.js";

/**
 * For checking if everything's connected.
 * 
 * Debugging tool.
 */
export function traverseBFSGraph(
  start: string,
  adj_list: Map<string, Area>,
  func: (path_ahead: string, path_current: string, curr_area: Area) => void | boolean
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
        const if_return = func(to, path, objects);
        if (if_return) {
          break;
        }
      }
    }
  }
}