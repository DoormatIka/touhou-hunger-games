import chalk from "chalk";
import { Player } from "./core/player.js";
import {
  Area,
  createGraph,
  getPlayersLength,
  shallowTraverseGraph
} from "./core/area.js";
import { markPlayers, sweepPlayer } from "./core/actions/mark.js";
import { arrayMoveTo } from "./core/actions/batchMove.js";

import { hv_objects, hv_routes } from "./core/data/locations/humanvillage.js";


const human_village = createGraph(hv_objects, hv_routes)
const road = human_village.get("Road")!

const players = ["Froshi", "Alice", "Small", "Juul", "Therapy"]
const stay_chance = 45;
const damage_limit = 10000;

for (const play of players) {
  const player = new Player(play, damage_limit, stay_chance);
  player.currentArea = "Road";
  road.players.push(player);
}

console.log(chalk.bgWhite(chalk.black("Small Scans Hunger Games")))
console.log(chalk.green(`${getPlayersLength(human_village)} players fighting.`))

const prev = performance.now()
console.dir(human_village, { depth: 0 })
// main(human_village)
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
  console.log(`Developed by ${chalk.bgBlack(`${chalk.blueBright("7")} ${chalk.yellowBright("Colors")} ${chalk.redBright("Alice")}`)}.`)
}