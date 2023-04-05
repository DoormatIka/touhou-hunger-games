import chalk from "chalk";
import { Player } from "./core/player.js";
import {
  Area,
  createGraph,
  getPlayersLength,
  shallowTraverseGraph
} from "./core/area.js";
import { markPlayers, sweepPlayer } from "./core/actions/mark.js";
import { arrayMoveTo } from "./core/actions/move.js";

const hv_objects = [
  "Road",
  "Alice's House",
  "Small's House",
  "Plaza"
];
const hv_routes = [
  ["Alice's House", "Road"],
  ["Alice's House", "Plaza"],
  ["Small's House", "Road"],
  ["Road", "Plaza"]
];

const adj_list = createGraph(hv_objects, hv_routes)
const road = adj_list.get("Road")!

const players = ["Froshi", "Alice", "Small", "Juul"]
const chance_movement = 10;
const damage_limit = 1000;

for (const play of players) {
  const player = new Player(play, 1000, 10);
  player.currentArea = "Road";
  road.players.push(player);
}

console.log(chalk.bgWhite(chalk.black("Small Scans Hunger Games")))
console.log(chalk.green(`${getPlayersLength(adj_list)} players fighting.`))

const prev = performance.now()
main(adj_list)
const curr = performance.now()

console.log(`${chalk.bgGreen(chalk.black(`Performance`))}: ${curr-prev}ms taken.`)


function main(adj_list: Map<string, Area>) {
  let rounds = 0;
  // while (getPlayersLength(adj_list) > 1)
  while (getPlayersLength(adj_list) > 1) {
    console.log(chalk.bgGray(chalk.bold(`Move ${rounds}`)))

    shallowTraverseGraph(adj_list, (area, current) => {
      arrayMoveTo(area, adj_list, 
        (player, moved_to) => {
          console.log(`${chalk.bgGreenBright(chalk.black("MOVE"))}: ${player.id} moved to ${moved_to} from ${current}`)
        },
        (player) => {
          console.log(`${chalk.bgGreen("STAY")}: ${player.id} stayed in ${current}`)
        });
    })

    
    shallowTraverseGraph(adj_list, (area, curr) => {
      markPlayers(area, (unmarked, marked) => {
        console.log(`${chalk.bgRed("KILL")}: ${unmarked.id} fought with ${unmarked.foughtWith} with a power of ${unmarked.getFightingChance()} and ${marked.getFightingChance()} respectively`)
        console.log(`${chalk.bgGrey("DIED")}: ${unmarked.isAlive ? marked.id : unmarked.id} died with the fight.`)
      })
  
      for (let i = 0; i < area.players.length; i++) {
        area.players[i].hasPlayed = false;
        sweepPlayer(area, i);
      }
    })
    rounds++;
  }

  console.log(chalk.green(`${getPlayersLength(adj_list)} players left.`))
}