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
  "Lily's Room", "Gate",
  "Youmu's Room",
]
const hh_routes = [
  ["Lily's Room", "Gate"],
  ["Youmu's Room", "Gate"]
]

const combined = combineSubLocations(
  { name: "Human Village", objects: hv_objects, routes: hv_routes, gate: ["DS-HV"] },
  { name: "Dragon Statue", objects: ds_objects, routes: ds_routes, gate: ["DS-HV", "HH-HV"] },
  { name: "Lily's Home", objects: hh_objects, routes: hh_routes, gate: ["HH-HV", "PP-PPPPP"] }
)

console.log(createGraph(combined.objects, combined.routes))

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
    for (const localobject of location.objects) { // REFRACTOR!!
      if (localobject === "Gate") {
        for (const connectors of location.gate) {
          objects.add(`Gate ${connectors}`); // something is duplicating here.
        }
        continue;
      }
      objects.add(`${location.name} - ${localobject}`)
    }

    for (const localroutes of location.routes) { // ["Lily's Room", "Gate"]
      for (const connectors of location.gate) { // REFRACTOR!!
        routes.push(localroutes.map(v => {
          if (v === "Gate") {
            return `Gate ${connectors}`;
          }
          return `${location.name} - ${v}`
        }))
      }
    }
  }

  return { 
    objects: [...objects], // bandaid fix for duplication
    routes 
  };
}