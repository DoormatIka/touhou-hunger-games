import chalk from "chalk";
import { PlayerPresets, createPlayers } from "../core/player.js";
import {
  Area,
  createGraph,
  getLastPlayer,
  getPlayersLength,
  shallowTraverseGraph
} from "../core/area.js";
import { markPlayers, sweepPlayer } from "../core/actions/mark.js";
import { arrayMoveTo } from "../core/actions/batchMove.js";
import { combineSubLocations } from "../core/data/locations/location.js";

import { ds_rooms, ds_gates, ds_routes } from "../core/data/locations/humanvillage/dragonstatue.js"
import { field1_gates, field1_rooms, field1_routes } from "../core/data/locations/humanvillage/fields/field1.js"
import { hh_gates, hh_rooms, hh_routes } from "../core/data/locations/humanvillage/hiedahouse.js"
import { ss_rooms, ss_gates, ss_routes } from "../core/data/locations/humanvillage/smallshrine.js";

import playerConfig from "../player_config.json" assert { type: "json" };


const winCounts = new Map<PlayerPresets, { wins: number, rounds: number }>() ;
winCounts.set("TANK", { wins: 0, rounds: 0 });
winCounts.set("NORMAL", { wins: 0, rounds: 0 });
winCounts.set("LIGHT", { wins: 0, rounds: 0 });

const length = 99999

console.time("Time taken for the entire project")
for (let i = 0; i < length; i++) {
  const human_village = createGraph(combineSubLocations(
    { name: "Grass Fields", objects: field1_rooms, routes: field1_routes, gate: field1_gates },
    { name: "Dragon Statue", objects: ds_rooms, routes: ds_routes, gate: ds_gates },
    { name: "Hieda House", objects: hh_rooms, routes: hh_routes, gate: hh_gates },
    { name: "Small Shrine", objects: ss_rooms, routes: ss_routes, gate: ss_gates }
  ));
  const road = human_village.get("Dragon Road")!
  road.players.push(...createPlayers(playerConfig as { player: string, preset: PlayerPresets }[], "Dragon Road"))
  const last_player = main(human_village)

  if (last_player.last_player) {
    let win = winCounts.get(last_player.last_player.getType())!
    winCounts.set(last_player.last_player.getType(), { wins: win.wins += 1, rounds: win.rounds += last_player.rounds });
  }
}
console.timeEnd("Time taken for the entire project")

for (const val of winCounts.values()) {
  val.rounds = val.rounds / length
}

console.log(winCounts)


function main(adj_list: Map<string, Area>) {
  let rounds = 0;

  while (getPlayersLength(adj_list) > 1) {
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
  return { last_player, rounds }
}