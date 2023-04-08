import chalk from "chalk";
import { Player } from "../core/player.js";
import {
  Area,
  createGraph,
  getLastPlayer,
  shallowTraverseGraph
} from "../core/area.js";
import { markPlayers, sweepPlayer } from "../core/actions/mark.js";
import { arrayMoveTo } from "../core/actions/batchMove.js";

console.log(chalk.bgWhite(chalk.black("Small Scans Hunger Games")))

const len_areas = 10000;
const len_players = 10000;
const iterations = 1000;
const routes = [];
const objects = ["Road"];

console.log(chalk.green(`${len_players} players fighting with ${len_areas + 1} rooms.\nIterating with ${iterations} iterations`))

for (let i = 0; i < len_areas; i++) {
  routes.push(["Road", `House ${i}`])
  objects.push(`House ${i}`)
}

console.time("Graph Creation")
const human_village = createGraph({
  objects: objects,
  routes: routes
});
console.timeEnd("Graph Creation")

const road = human_village.get("Road")!
for (let i = 0; i < len_players; i++) {
  road.players.push(new Player(`p${i}`, 100, 15));
}

console.time("MAIN")
const last_player = main(human_village, iterations)
console.timeEnd("MAIN")


function main(adj_list: Map<string, Area>, iterations: number) {
  // let rounds = 0;
  for (let i = 0; i < iterations; i++) {
    shallowTraverseGraph(adj_list, (area, current) => {
      arrayMoveTo(area, adj_list, (player, moved_to) => {}, (player) => {});
    })
    shallowTraverseGraph(adj_list, (area, curr) => {
      markPlayers(area, (unmarked, marked) => {})
      for (let i = 0; i < area.players.length; i++) {
        area.players[i].hasPlayed = false;
        sweepPlayer(area, i);
      }
    })
    // rounds++;
  }
  const last_player = getLastPlayer(adj_list);
  // return { rounds, last_player }
}