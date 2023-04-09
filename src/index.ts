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
import { vsPlayers, sweepPlayer, randomDeathPlayers } from "./core/actions/mark.js";
import { arrayMoveTo } from "./core/actions/batchMove.js";
import { chooseDeath, chooseKill, chooseMove, chooseStay } from "./core/data/responses/response.js";

import human_village_scaffold from "./core/data/locations/compiled/humanvillage.json" assert { type: "json" }
import playerConfig from "./player_config.json" assert { type: "json" };

console.log(chalk.bgWhite(chalk.black("Small Scans Hunger Games")))

const human_village = createGraph(human_village_scaffold);

const road = human_village.get("Dragon Road")!
road.players.push(...createPlayers(playerConfig, "Dragon Road"))
console.log(chalk.green(`${getPlayersLength(human_village)} players fighting with ${getAreaLength(human_village)} rooms.`))
/*
traverseBFSGraph("Dragon Road", human_village, (ahead, current) => {
  console.log(`${current} => ${ahead}`)
})
console.log(`Number of areas: ${getAreaLength(human_village)}`)
*/
const last_player = main(human_village)


function main(adj_list: Map<string, Area>) {
  let rounds = 0;
  // while (getPlayersLength(adj_list) > 1)
  while (getPlayersLength(adj_list) > 1) {
    console.log(chalk.bgGray(chalk.bold(`Move ${rounds}`)))

    shallowTraverseGraph(adj_list, (area, current) => {
      arrayMoveTo(area, adj_list,
        (player, moved_to) => {
          console.log(`${chalk.bgGreenBright(chalk.black("MOVE"))}: ${chooseMove(player.id, moved_to, current)}`)
        },
        (player) => {
          console.log(`${chalk.bgGreen("STAY")}: ${chooseStay(player.id, current)}`)
        });
    })

    shallowTraverseGraph(adj_list, (area, curr) => {
      if (rounds > 3) {
        vsPlayers(area, (unmarked, marked) => {
          console.log(`${chalk.bgRed("KILL")}: ${chooseKill(marked.id, unmarked.id, marked.getFightingChance(), unmarked.getFightingChance())}`)
          console.log(`${chalk.bgGrey("DIED")}: ${unmarked.isAlive ? marked.id : unmarked.id} died in ${curr}`)
        })
        randomDeathPlayers(area, (dead) => {
          console.log(`${chalk.bgGrey("DIED")}: ${chooseDeath(dead.id)}`)
        })
      }
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