import { Area, createGraph } from "../../area.js";


// gate for connecting/merging two graphs together
/**
 * Connects two graphs together.
 * 
 * @param locations locations to combine
 *  - gate: entry points when connecting the two graphs together
 *  - routes: connecting the gates and objects together
 *  - objects: the rooms in your locations
 * @returns the combined objects and routes
 */
export function combineSubLocations(
  ...locations: {
    name: string,
    objects: string[],
    routes: string[][],
    gate: string[]
  }[]
) {
  const objects: Set<string> = new Set();
  const routes: string[][] = [];

  for (const location of locations) {
    addInRooms(location, objects);
    addInRoutes(location, routes);
  }

  return {
    objects: [...objects], // bandaid fix for duplication
    routes
  };
}

function addInRoutes(location: { name: string; objects: string[]; routes: string[][]; gate: string[]; }, routes: string[][]) {
  for (const localroutes of location.routes) { // ["Lily's Room", "Gate"]
    routes.push(localroutes.map(route => {
      const gate = location.gate.find(gate => gate === route)
      if (gate) {
        return gate;
      }
      return `${location.name} | ${route}`;
    }));

  }
}

function addInRooms(location: { name: string; objects: string[]; routes: string[][]; gate: string[]; }, objects: Set<string>) {
  for (const localobject of location.objects) {
    const gate = location.gate.find(gate => gate === localobject)
    if (gate) {
      objects.add(gate);
      continue;
    }
    objects.add(`${location.name} | ${localobject}`);
  }
}

/**
 * For checking if everything's connected.
 * 
 * Debugging tool.
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