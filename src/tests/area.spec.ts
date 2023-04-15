import assert from "assert";
import { describe } from "node:test";
import { combineSubLocations } from "../core/data/locations/location.js";
import { Area, createGraph, labelDistances } from "../core/area.js";

const area1_name = "Area 1 Gate"
const area2_name = "Area 2 | Area 2"

describe("Area", function () {
  describe("combineSubLocations()", function () {
    it("should convert multiple routes and rooms into one", function () {
      const locations = createMockSubLocations()
      assert.deepStrictEqual(
        locations,
        { 
          objects: [area1_name, area2_name], 
          routes: [[area1_name, area2_name]] 
        }
      )
    })
  })
  describe("createGraph()", function () {
    it("should create a graph data structure", function () {
      const graph = createGraph(createMockSubLocations());
      const compared = createMockGraph()

      assert.deepStrictEqual(graph, compared)
    })
  })
  describe("labelDistances()", function () {
    it("labels how far each nodes are", function () {
      const graph = createGraph(createMockSubLocations());
      const mocked_graph = createMockGraph();

      mocked_graph.get(area1_name)!.layer = 0;
      mocked_graph.get(area2_name)!.layer = 1;

      labelDistances(area1_name, graph);

      assert.deepStrictEqual(graph, mocked_graph);
    })
  })
})

function createMockSubLocations() {
  return combineSubLocations(
    { name: "Area 1", objects: ["Area 1 Gate"], routes: [], gate: ["Area 1 Gate"] },
    { name: "Area 2", objects: ["Area 2"], routes: [["Area 1 Gate", "Area 2"]], gate: ["Area 1 Gate"] }
  );
}

function createMockGraph() {
  const compared = new Map<string, Area>()
  const area1 = new Area(area1_name);
  const area2 = new Area(area2_name);
  area1.to.push(area2_name);
  area2.to.push(area1_name);

  compared.set("Area 1 Gate", area1);
  compared.set("Area 2 | Area 2", area2);
  return compared;
}