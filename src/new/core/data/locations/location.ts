import { createGraph } from "../../area.js";


// gate for connecting/merging two graphs together
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
