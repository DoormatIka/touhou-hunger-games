import chalk from "chalk";
import { Player } from "./player.js";
import {
  createGraph,
  getPlayersLength,
} from "./area.js";
import { shallowMarkPlayers, shallowSweepPlayers } from "./actions/mark.js";
import { moveRandom } from "./actions/move.js";


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

const playerLen = 50;
for (let i = 0; i < playerLen; i++) {
  const player = new Player(`p${i}`);
  player.currentArea = "Road";
  road.players.push(player);
}

const map = new Map()

let j = 0;
const len = 15;

for (let i = 0; i < len; i++) {
  console.log("\n")
  console.log( chalk.bgGray(chalk.bold(`Move ${j+1}`)) )
  console.log(`${getPlayersLength(adj_list)} players left.`)

  for (let i = 0; i < playerLen; i++) { // MOVING PHASE
    const moved = moveRandom(`p${i}`, adj_list)
    if (moved) {
      console.log(`${chalk.bgGray("MOVE")}: Moved p${i} to ${moved.from} from ${moved.to}`);
    }
  }
  shallowMarkPlayers(adj_list, (killed, alive) => {
    console.log(`${chalk.bgRedBright("KILL:")} ${killed.id} has been killed by ${alive.id}.`);
  });
  shallowSweepPlayers(adj_list);

  j++;
}