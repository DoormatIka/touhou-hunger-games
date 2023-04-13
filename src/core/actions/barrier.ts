import { createGraph } from "../area.js";
import { traverseBFSGraph } from "../data/locations/location.js";

const graph = createGraph({ 
  objects: [
    "Road", 
    "House 1", 
    "House 2", 
    "House 3",
    "House 4",
    "House 2.5"
  ], 
  routes: [
    ["Road", "House 1"],
    ["House 1", "House 2"],
    ["House 2", "House 3"],
    ["House 2", "House 2.5"],
    ["House 3", "House 4"]
  ]
})

let layer = 1;
traverseBFSGraph("Road", graph, (ahead, curr) => {
  const area_curr = graph.get(curr)!;

  area_curr.to.forEach((v) => {
    const area_get = graph.get(v);
    if (!area_get!.layer) {
      area_get!.layer = layer;
      layer++;
    } 
  }) 
})

traverseBFSGraph("Road", graph, (a, c) => {
  console.log(`${c} | ${graph.get(c)!.layer}`)
})

