import chalk from "chalk";
import { generateRandomNumber, Player } from "./core/player.js";
import {
  createGraph,
  getPlayersLength,
  shallowTraverseGraph
} from "./core/area.js";
import { markPlayers, sweepPlayer } from "./core/actions/mark.js";
import {batchMoveTo} from "./core/actions/move.js";

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

const playerLen = 5;
for (let i = 0; i < playerLen; i++) {
  const player = new Player(`p${i}`);
  player.currentArea = "Road";
  road.players.push(player);
}

const map = new Map()

console.log(chalk.bgGray(chalk.bold(`Move 1`)))
console.log(`${getPlayersLength(adj_list)} players left.`)

shallowTraverseGraph(adj_list, (area, current) => {

  console.log(`Checking location "${current}" for players.`)
  console.log(`Players have: ${area.players.length}`)
  
  // keeps skipping odd ids for some reason
  for (let i = 0; i < area.players.length; i++) {
    const currPlayer = area.players[i]
    if (currPlayer.hasMoved) continue;
    console.log(`${currPlayer.id}'s turn: ${i}`)

    const ran = generateRandomNumber(area.to.length - 1);
    const chosenArea = adj_list.get(area.to[ran])!

    currPlayer.hasMoved = true;
    console.log(`${area.to[ran]} area chosen by ${currPlayer.id} from ${current}`)
    chosenArea.players.push(area.players.splice(i, 1)[0]);
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
console.dir(adj_list, {depth: null})
