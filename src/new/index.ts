import chalk from "chalk";
import { Player } from "./core/player.js";
import {
  createGraph,
  getPlayersLength,
  shallowTraverseGraph
} from "./core/area.js";
import { markPlayers, sweepPlayer } from "./core/actions/mark.js";

const hv_objects = [
  "Road",
  "House 1",
  "House 2",
  "House 3",
  "House 4",
];
const hv_routes = [
  ["House 1", "Road"], ["House 1", "House 2"],
  ["House 2", "Road"], ["House 2", "House 3"],
  ["House 3", "Road"],
  ["House 4", "Road"],
];

const adj_list = createGraph(hv_objects, hv_routes)
const road = adj_list.get("Road")!

const playerLen = 10;
for (let i = 0; i < playerLen; i++) {
  const player = new Player(`p${i}`);
  player.currentArea = "Road";
  road.players.push(player);
}

const map = new Map()

console.log(chalk.bgGray(chalk.bold(`Move 1`)))
console.log(`${getPlayersLength(adj_list)} players left.`)

shallowTraverseGraph(adj_list, (area, current) => {
  if (area.players.length == 0) return;

  for (const player of area.players) {
    
  }

  /*
  markPlayers(area, (unmarked, marked) => {
    console.log(`${unmarked.id} fought with ${unmarked.foughtWith} with a power of ${unmarked.getFightingChance()} and ${marked.getFightingChance()} respectively`)
    console.log(`${unmarked.isAlive ? marked.id : unmarked.id} died with the fight. \n`)
  })

  for (let i = 0; i < area.players.length; i++) {
    sweepPlayer(area, i);
  }
  */
})

console.log(`${getPlayersLength(adj_list)} players left.`)