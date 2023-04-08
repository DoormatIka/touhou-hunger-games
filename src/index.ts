import chalk from "chalk";
import { createPlayers } from "./core/player.js";
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
import { field1_gates, field1_rooms, field1_routes } from "./core/data/locations/humanvillage/fields/hiedafields.js"
import { hh_gates, hh_rooms, hh_routes } from "./core/data/locations/humanvillage/hiedahouse.js"
import { ss_rooms, ss_gates, ss_routes } from "./core/data/locations/humanvillage/smallshrine.js";
import { houses_rooms, houses_routes, houses_gates } from "./core/data/locations/humanvillage/houses.js";
import { v_fields_rooms, v_fields_gates, v_fields_routes } from "./core/data/locations/humanvillage/fields/villagefields.js";

import { chooseKill } from "./core/data/responses/response.js";

import playerConfig from "./player_config.json" assert { type: "json" };

console.log(chalk.bgWhite(chalk.black("Small Scans Hunger Games")))

const human_village = createGraph(combineSubLocations(
  { name: "Grass Fields", objects: field1_rooms, routes: field1_routes, gate: field1_gates },
  { name: "Dragon Statue", objects: ds_rooms, routes: ds_routes, gate: ds_gates },
  { name: "Hieda House", objects: hh_rooms, routes: hh_routes, gate: hh_gates },
  { name: "Small Shrine", objects: ss_rooms, routes: ss_routes, gate: ss_gates },
  { name: "Houses", objects: houses_rooms, routes: houses_routes, gate: houses_gates },
  { name: "Village Fields", objects: v_fields_rooms, routes: v_fields_routes, gate: v_fields_gates }
));
const road = human_village.get("Dragon Road")!
road.players.push(...createPlayers(playerConfig, "Dragon Road"))
console.log(chalk.green(`${getPlayersLength(human_village)} players fighting with ${getAreaLength(human_village)} rooms.`))
const last_player = main(human_village)


function main(adj_list: Map<string, Area>) {
  let rounds = 0;
  // while (getPlayersLength(adj_list) > 1)
  while (getPlayersLength(adj_list) > 1) {
    console.log(chalk.bgGray(chalk.bold(`Move ${rounds}`)))

    shallowTraverseGraph(adj_list, (area, current) => {
      arrayMoveTo(area, adj_list,
        (player, moved_to) => {
          console.log(`${chalk.bgGreenBright(chalk.black("MOVE"))}: ${chalk.blueBright(player.id)} moved to "${moved_to}" from "${current}"`)
        },
        (player) => {
          console.log(`${chalk.bgGreen("STAY")}: ${chalk.blueBright(player.id)} stayed in "${current}"`)
        });
    })

    shallowTraverseGraph(adj_list, (area, curr) => {
      markPlayers(area, (unmarked, marked) => {
        console.log(`${chalk.bgRed("KILL")}: ${chooseKill(marked.id, unmarked.id, marked.getFightingChance(), unmarked.getFightingChance())}`)
        console.log(`${chalk.bgGrey("DIED")}: ${unmarked.isAlive ? marked.id : unmarked.id} died in ${curr}`)
      })

      for (let i = 0; i < area.players.length; i++) {
        area.players[i].hasPlayed = false;
        sweepPlayer(area, i);
      }
    })
    rounds++;
  }
  const last_player = getLastPlayer(adj_list);

  console.log(chalk.green(`${getPlayersLength(adj_list)} players left.`))
  console.log(`${chalk.bgYellowBright(chalk.black(`WIN`))}: ${last_player?.id} won!`) 
  console.log(`Developed by ${chalk.bgBlack(`${chalk.blueBright("7")} ${chalk.yellowBright("Colors")} ${chalk.redBright("Alice")}`)}.`)
  return { rounds, last_player }
}