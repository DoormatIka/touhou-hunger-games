import { createGraph } from "../../area.js";

const hv_objects = [
  "Road", "Gate"
];
const hv_routes = [
  ["Road", "Gate"]
];

const ds_objects = [
  "Room", "Gate"
]
const ds_routes = [
  ["Room", "Gate"]
]

const hh_objects = [
  "Lily's Room", "Room",
  "Youmu's Room",
]
const hh_routes = [
  ["Lily's Room", "Room"],
  ["Youmu's Room", "Lily's Room"]
]

console.log(createGraph(combineSubLocations(
  { name: "Human Village", objects: hv_objects, routes: hv_routes, gate: [{ name: "Dragon", gate_name: "Gate" }] },
  { name: "Dragon Statue", objects: ds_objects, routes: ds_routes, gate: [{ name: "Lily's", gate_name: "Room" }, { name: "Dragon", gate_name: "Gate" }] },
  { name: "Lily's Home", objects: hh_objects, routes: hh_routes, gate: [{ name: "Lily's", gate_name: "Room" }] }
)))

// gate for connecting/merging two graphs together
export function combineSubLocations(
  ...locations: { 
    name: string,
    objects: string[],
    routes: string[][],
    gate: { name: string, gate_name: string }[]
  }[]
) {
  const objects: Set<string> = new Set();
  const routes: string[][] = [];

  for (const location of locations) {
    for (const localobject of location.objects) { // REFRACTOR!!
      for (const connectors of location.gate) {
        if (localobject === connectors.gate_name) {
          objects.add(`${connectors.gate_name} ${connectors.name}`);
          continue;
        }
        objects.add(`${location.name} - ${localobject}`)
      }
    }

    for (const localroutes of location.routes) { // ["Lily's Room", "Gate"]
      for (const connectors of location.gate) { // REFRACTOR!!
        routes.push(localroutes.map(v => {
          if (v === connectors.gate_name) {
            return `${connectors.gate_name} ${connectors.name}`;
          }
          return `${location.name} >> ${v}`
        }))
      }
    }
  }

  return { 
    objects: [...objects], // bandaid fix for duplication
    routes 
  };
}