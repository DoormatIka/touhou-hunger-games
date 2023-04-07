import chalk from "chalk";
import { Player, PlayerPresets, createPlayers } from "../core/player.js";
import {
  Area,
  createGraph,
  getAreaLength,
  getLastPlayer,
  getPlayersLength,
  shallowTraverseGraph
} from "../core/area.js";
import { markPlayers, sweepPlayer } from "../core/actions/mark.js";
import { arrayMoveTo } from "../core/actions/batchMove.js";

console.log(chalk.bgWhite(chalk.black("Small Scans Hunger Games")))

const len_areas = 10000;
const len_players = 10000;
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
  road.players.push(new Player(`p${i}`, 100, 50, "NORMAL"));
}

console.log(chalk.green(`${getPlayersLength(human_village)} players fighting with ${getAreaLength(human_village)} rooms.`))

const last_player = main(human_village, 50000)


function main(adj_list: Map<string, Area>, iterations: number) {
  let rounds = 0;
  for (let i = 0; i < iterations; i++) {
    // console.log(chalk.bgGray(chalk.bold(`Move ${rounds}`)))
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
    rounds++;
  }
  const last_player = getLastPlayer(adj_list);
  return { rounds, last_player }
}