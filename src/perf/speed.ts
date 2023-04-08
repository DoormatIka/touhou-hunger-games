import chalk from "chalk";
import { Player } from "../core/player.js";
import {
  Area,
  createGraph,
  getLastPlayer,
  shallowTraverseGraph
} from "../core/area.js";
import { vsPlayers, sweepPlayer } from "../core/actions/mark.js";
import { arrayMoveTo } from "../core/actions/batchMove.js";
import { traverseBFSGraph } from "../core/data/locations/location.js";

console.log(chalk.bgWhite(chalk.black("Small Scans Hunger Games")))

const len_areas = 9000;
const len_players = 25;
const iterations = 1;

console.log(chalk.green(`${len_players} players fighting with ${len_areas + 1} rooms.\nIterating with ${iterations} iterations`))

function createGraphs() {
  const routes = [];
  const objects = ["Road"];
  for (let i = 0; i < len_areas; i++) {
    routes.push(["Road", `House ${i}`])
    objects.push(`House ${i}`)
  }
  const human_village = createGraph({
    objects: objects,
    routes: routes
  });
  const road = human_village.get("Road")!
  for (let i = 0; i < len_players; i++) {
    road.players.push(new Player(`p${i}`, 100, 0));
  }
  return human_village;  
}

const shallowG = createGraphs()
console.time("shallow")
for (let i = 0; i < iterations; i++) {
  shallowmain(shallowG)
}
console.timeEnd("shallow")

const bfsG = createGraphs()
console.time("BFS")
for (let i = 0; i < iterations; i++) {
  BFSmain(bfsG)
}
console.timeEnd("BFS")


function shallowmain(adj_list: Map<string, Area>) { // current
  // let rounds = 0;
    shallowTraverseGraph(adj_list, (area, current) => {
      arrayMoveTo(area, adj_list, (player, moved_to) => {}, (player) => {});
    })
    shallowTraverseGraph(adj_list, (area, curr) => {
      vsPlayers(area, (unmarked, marked) => {})
      for (let i = 0; i < area.players.length; i++) {
        area.players[i].hasPlayed = false;
        sweepPlayer(area, i);
      }
    })
    // rounds++;
  const last_player = getLastPlayer(adj_list);
  // return { rounds, last_player }
}

function BFSmain(adj_list: Map<string, Area>) { // old implementation
    traverseBFSGraph("Road", adj_list, (area, current) => {
      arrayMoveTo(adj_list.get(area)!, adj_list, (player, moved_to) => {}, (player) => {});
    })
    traverseBFSGraph("Road", adj_list, (area, curr) => {
      const a = adj_list.get(area)!;
      vsPlayers(a, (unmarked, marked) => {})
    })
    traverseBFSGraph("Road", adj_list, (area, curr) => {
      const a = adj_list.get(area)!;
      for (let i = 0; i < a.players.length; i++) {
        a.players[i].hasPlayed = false;
        sweepPlayer(a, i);
      }
    })
    // rounds++;
  const last_player = getLastPlayer(adj_list);
  // return { rounds, last_player }
}