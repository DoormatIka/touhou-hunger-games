import chalk from "chalk";
import { Player } from "./core/player.js";
import {
  Area,
  createGraph,
  getAreaLength,
  getLastPlayer,
  getPlayersLength,
  shallowTraverseGraph
} from "./core/area.js";
import { markPlayers, sweepPlayer } from "./core/actions/mark.js";
import { arrayMoveTo } from "./core/actions/batchMove.js";
import { combineSubLocations } from "./core/data/locations/location.js";

import { ds_rooms, ds_gates, ds_routes } from "./core/data/locations/humanvillage/dragonstatue.js"
import { field1_gates, field1_rooms, field1_routes } from "./core/data/locations/humanvillage/fields/field1.js"
import { hh_gates, hh_rooms, hh_routes } from "./core/data/locations/humanvillage/hiedahouse.js"
import { ss_rooms, ss_gates, ss_routes } from "./core/data/locations/humanvillage/smallshrine.js";

const players = ["Froshi", "Alice", "Small", "Juul", "Therapy", "Gemma", "Aoko"]
const damage_limit = 100;


for (let i = 0; i < 10; i++) {
  const stay_chance = 35;
  const human_village = createGraph(combineSubLocations(
    { name: "Grass Fields", objects: field1_rooms, routes: field1_routes, gate: field1_gates },
    { name: "Dragon Statue", objects: ds_rooms, routes: ds_routes, gate: ds_gates },
    { name: "Hieda House", objects: hh_rooms, routes: hh_routes, gate: hh_gates },
    { name: "Small Shrine", objects: ss_rooms, routes: ss_routes, gate: ss_gates }
  ));
  const road = human_village.get("Dragon Road")!

  for (const play of players) {
    const player = new Player(play, damage_limit, stay_chance);
    player.currentArea = "Dragon Road";
    road.players.push(player);
  }
  console.log(chalk.bgWhite(chalk.black("Small Scans Hunger Games")))
  console.log(chalk.green(`${getPlayersLength(human_village)} players fighting with ${getAreaLength(human_village)} rooms.`))

  // const prev = performance.now()

  const rounds = main(human_village)
  console.log(`${chalk.bgGreen(chalk.black(`Stay chance`))}: ${stay_chance}.`)
  console.log(`${chalk.bgGreen(chalk.black(`Rounds`))}: ${rounds}. \n`)
  // const curr = performance.now()

  // console.log(`${chalk.bgGreen(chalk.black(`Performance`))}: ${curr-prev}ms taken.`)
}



function main(adj_list: Map<string, Area>) {
  let rounds = 0;

  while (getPlayersLength(adj_list) > 1) {
    // console.log(chalk.bgGray(chalk.bold(`Move ${rounds}`)))

    shallowTraverseGraph(adj_list, (area, current) => {
      arrayMoveTo(area, adj_list, 
        (player, moved_to) => {
          // console.log(`${chalk.bgGreenBright(chalk.black("MOVE"))}: ${player.id} moved to "${moved_to}" from "${current}"`)
        },
        (player) => {
          // console.log(`${chalk.bgGreen("STAY")}: ${player.id} stayed in "${current}"`)
        });
    })

    
    shallowTraverseGraph(adj_list, (area, curr) => {
      markPlayers(area, (unmarked, marked) => {
        // console.log(`${chalk.bgRed("KILL")}: ${unmarked.id} fought with ${unmarked.foughtWith} with a power of ${unmarked.getFightingChance()} and ${marked.getFightingChance()} respectively`)
        // console.log(`${chalk.bgGrey("DIED")}: ${unmarked.isAlive ? marked.id : unmarked.id} died with the fight.`)
      })
  
      for (let i = 0; i < area.players.length; i++) {
        area.players[i].hasPlayed = false;
        sweepPlayer(area, i);
      }
    })
    rounds++;
  }

  // console.log(chalk.green(`${getPlayersLength(adj_list)} players left.`))
  // console.log(`${chalk.bgYellowBright(chalk.black(`WIN`))}: ${getLastPlayer(adj_list)?.id} won!`) 
  // console.log(`Developed by ${chalk.bgBlack(`${chalk.blueBright("7")} ${chalk.yellowBright("Colors")} ${chalk.redBright("Alice")}`)}.`)
  return rounds;
}